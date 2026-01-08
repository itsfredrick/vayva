import { NextResponse, type NextRequest } from "next/server";

const rateLimit = new Map<string, { count: number; lastReset: number }>();

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  let hostname = request.headers.get("host") || "";

  // Handle localhost for development
  if (hostname.includes("localhost") && hostname.includes(":")) {
    // If localhost, we might be testing subdomains like "demo.localhost:3000"
    // But usually locally we might access via path or just assume single tenant for dev if no custom hosts file.
    // For this fix, let's treat "localhost:3000" as the main app, and subdomains if present.
  }

  // Define the main domain (in prod)
  // const currentHost = hostname.replace(`.vayva.ng`, ""); // "demo"

  // 1. Rewrite Logic (Sector 2 Fix)
  // Check if it's a subgraph/custom domain
  // We exclude the main domain "vayva.ng" and "www.vayva.ng" (Marketing)
  // And "app.vayva.ng" (Merchant Admin - handled by different app usually, but if routed here, careful)

  // Since this is the "Storefront" app middleware, we assume traffic coming here IS for the storefronts or the marketing site.
  // We need to differentiate "Marketing" vs "Store".

  // Simplified Logic per Prompt:
  // If subdomain exists and is not 'www', rewrite to /_sites/[subdomain]

  // Clean hostname to get subdomain
  // logic: if hostname is "freds-shop.vayva.ng", subdomain is "freds-shop"
  const isVercelDomain = hostname.includes("vercel.app"); // fallback
  const rootDomain = isVercelDomain ? "vercel.app" : "vayva.ng"; // Adjust validation as needed

  // Extract subdomain
  // const subdomain = hostname.split('.')[0]; -- Reference logic

  // Better parsing:
  const searchParams = request.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // Check if subdomain
  // We look for [slug].vayva.ng
  // Exclude 'www' and base domain
  if (
    hostname.includes(".") &&
    hostname !== "vayva.ng" &&
    hostname !== "www.vayva.ng" &&
    !hostname.startsWith("localhost") // Simple dev check, can refine
  ) {
    const subdomain = hostname.split(".")[0];
    // Rewrite to the dynamic route
    console.log(`[Middleware] Rewriting ${hostname}${path} to /_sites/${subdomain}${path}`);
    return NextResponse.rewrite(new URL(`/_sites/${subdomain}${path}`, request.url));
  }

  // Development / Localhost Loopback for testing
  // Allow accessing /_sites/demo explicitly or handle localhost mapping if using tools like ngrok
  // For now, if we are on localhost and NOT a subdomain (just localhost:3000), act as landing page.

  const response = NextResponse.next();

  // Standard Security Headers
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

  // Simple In-Memory Rate Limit (Ephemeral)
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 Minute
  const API_LIMIT = 300; // 300 req/min

  const key = ip;
  const now = Date.now();
  const record = rateLimit.get(key) || { count: 0, lastReset: now };

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    record.count = 0;
    record.lastReset = now;
  }

  record.count++;
  rateLimit.set(key, record);


  if (record.count > API_LIMIT) {
    return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": "60",
      },
    });
  }

  // Security Hardening: Block /paystack-test in production/test environments
  // We check for NODE_ENV match and absence of IS_TEST_MODE bypass
  if (
    request.nextUrl.pathname === "/paystack-test" &&
    (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") &&
    process.env.IS_TEST_MODE !== "true"
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 2. CSP (Content Security Policy)
  // Allows scripts/styles from self and inline (required for Next.js hydration/styles).
  // Allows images from Unsplash as per config.
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
