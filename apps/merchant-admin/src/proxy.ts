import { NextResponse, type NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // --- 1. OPS AUTH GUARD ---
  // Protect /ops and /api/ops
  if (path.startsWith("/ops") || path.startsWith("/api/ops")) {
    // Whitelist public routes
    const isPublic =
      path === "/ops/login" ||
      path.startsWith("/ops/auth") ||
      path.startsWith("/api/ops/auth");

    if (!isPublic) {
      const opsToken = request.cookies.get("ops_session_v1");
      if (!opsToken) {
        if (path.startsWith("/api")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const loginUrl = new URL("/ops/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // --- 2. LEGACY PROXY / CSP LOGIC ---
  // Skip CSP for APIs (Legacy behavior)
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  // CSP Generation
  // Using Buffer because Environment supports it (Node or Polyfill present in repo)
  // If Buffer fails in Edge, switch to btoa/globalThis.crypto
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Minimal CSP for V1. In prod, lock this down further.
  // We allow 'unsafe-inline' for styles because many UI libs need it.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline'; 
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.vayva.ng;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.vayva.ng;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    cspHeader.replace(/\s{2,}/g, " ").trim(),
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    "Content-Security-Policy",
    cspHeader.replace(/\s{2,}/g, " ").trim(),
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
