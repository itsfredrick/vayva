import { NextResponse, type NextRequest } from "next/server";
import { resolveRequest } from "@/lib/routing/tenant-engine";

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

  const response = NextResponse.next();

  // 1. Security Headers
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

  // 2. Auth Guard (Merchant Admin)
  const protectedPaths = [
    "/onboarding",
    "/dashboard",
    "/settings",
    "/control-center",
    "/", // Protect root to force auth check/redirect
  ];
  // Strict check for root path to avoid matching everything
  const isProtected =
    path === "/" || protectedPaths.some((p) => path.startsWith(p) && p !== "/");

  if (isProtected) {
    // Check for both legacy NextAuth and our new Custom Session
    const token =
      request.cookies.get("vayva_session") ||
      request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token");

    if (!token) {
      const url = request.nextUrl.clone();
      // Redirect to signin if not marketing landing or public routes
      url.pathname = "/signin";
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
