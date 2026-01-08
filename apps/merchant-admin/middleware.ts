import { NextResponse, type NextRequest } from "next/server";
import { resolveRequest } from "@/lib/routing/tenant-engine";
import { getToken } from "next-auth/jwt";

// TODO: In production, move this to a Redis fetch or Edge Config.
const getTenantMap = async () => ({
  bloom: "tenant_bloom_001",
  gizmo: "tenant_gizmo_002",
  standard: "vayva-standard-id",
});

export async function middleware(request: NextRequest) {
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
    "/onboarding",
    "/dashboard",
    "/settings",
    "/control-center",
    "/", // Protect root to force auth check/redirect
  ];
  const isProtected =
    path === "/" || protectedPaths.some((p) => path.startsWith(p) && p !== "/");

  const tokenData = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (isProtected && !tokenData) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
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
  }

  const response = NextResponse.next();

  // 3. Security Headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://images.unsplash.com https://placehold.co;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
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
