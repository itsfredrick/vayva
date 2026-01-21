import { NextResponse, type NextRequest } from "next/server";
import { resolveRequest } from "@/lib/routing/tenant-engine";
import { getToken } from "next-auth/jwt";

import { redis } from "@/lib/redis";

const FALLBACK_TENANT_MAP: Record<string, string> = {
  bloom: "tenant_bloom_001",
  gizmo: "tenant_gizmo_002",
  standard: "vayva-standard-id",
};

const getTenantMap = async () => {
  try {
    const cached = await redis.get("tenant_map");
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn("Middleware: Failed to fetch tenant map from Redis", e);
  }
  return FALLBACK_TENANT_MAP;
};

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const path = request.nextUrl.pathname;
  const query = Object.fromEntries(request.nextUrl.searchParams);

  // 0. Tenant Resolution (AntiGravity Engine)
  const isPublicAsset =
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/images") ||
    path.startsWith("/healthz");

  if (!isPublicAsset) {
    const tenantMap = await getTenantMap();
    const resolution = resolveRequest({
      hostname,
      path,
      query,
      tenantMap,
      env: process.env.NODE_ENV || "development",
    });

    if (resolution.action === "rewrite" && resolution.destination) {
      return NextResponse.rewrite(new URL(resolution.destination, request.url));
    }

    if (resolution.action === "redirect" && resolution.destination) {
      return NextResponse.redirect(
        new URL(resolution.destination, request.url),
      );
    }

    if (resolution.action === "not_found" && resolution.destination) {
      return NextResponse.rewrite(new URL(resolution.destination, request.url));
    }
  }

  // 1. Auth Guard (Merchant Admin)
  const protectedPaths = [
    "/dashboard",
    "/settings",
    "/control-center",
    "/verify", // Verify is protected but accessible to unverified users
    "/", // Protect root to force auth check/redirect
    "/onboarding", // Protect onboarding flow
    "/designer", // Protect theme editor
    "/billing", // Protect billing pages
  ];
  const isProtected =
    path === "/" || protectedPaths.some((p) => path.startsWith(p) && p !== "/");

  const tokenData = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (isProtected) {
    // 1.1 Unauthenticated -> Sign In
    if (!tokenData) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }

    // 1.2 Unverified Email -> /verify
    if (!tokenData.emailVerified && !path.startsWith("/verify")) {
      return NextResponse.redirect(new URL("/verify", request.url));
    }

    // 1.3 Verified but trying to access /verify -> /dashboard
    if (tokenData.emailVerified && path.startsWith("/verify")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Trial Expiry Hard-Lock
  if (tokenData && tokenData.plan === "FREE" && tokenData.trialEndsAt) {
    const trialEndsAt = new Date(tokenData.trialEndsAt as string);
    const isExpired = new Date() > trialEndsAt;

    // Allow only billing page if expired
    const isBillingPage = path.startsWith("/dashboard/billing");
    const isTrialExpiredPage = path === "/billing/trial-expired";

    if (isExpired && !isBillingPage && !isTrialExpiredPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/billing/trial-expired";
      url.searchParams.set("expired", "true");
      return NextResponse.redirect(url);
    }
    // 4. Industry Route Protection (Variant Guardrails)
    if (tokenData && tokenData.industrySlug) {
      const industry = tokenData.industrySlug as string;

      // Define restricted paths
      const foodPaths = ["/dashboard/food", "/dashboard/menu-items", "/dashboard/kitchen"];
      const retailPaths = ["/dashboard/products", "/dashboard/inventory"]; // Example
      const servicePaths = ["/dashboard/bookings", "/dashboard/services"];

      // Logic: If I am Retail, I cannot go to Food paths
      if (industry === "retail" && foodPaths.some(p => path.startsWith(p))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // If I am Food, I cannot go to Service paths (strict variant isolation)
      // (This depends on if we allow mixed stores. For V1, we assume strict.)
      if (industry === "food" && servicePaths.some(p => path.startsWith(p))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  const response = NextResponse.next();

  // 3. Security Headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-Frame-Options", "DENY"); // Use frame-ancestors for fine-grained control
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  // 3.1 Caching Strategy (API/Auth = No Store)
  if (path.startsWith("/api") || path.startsWith("/signin") || path.startsWith("/signup")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://images.unsplash.com https://placehold.co https://*.amazonaws.com https://*.vayva.ng https://*.paystack.co;
        font-src 'self' data:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        connect-src 'self' https://*.vayva.ng https://api.paystack.co;
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
