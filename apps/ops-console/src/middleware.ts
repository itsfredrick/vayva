import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Allow Public Routes (Login page, Static assets, Public API)
    // Note: /api/ops/auth/login is the only public API for ops
    const publicPaths = [
        "/ops/login",
        "/_next",
        "/favicon.ico",
        "/api/ops/auth/login",
    ];

    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // 2. Identify Protected Ops Routes
    const isOpsRoute = pathname.startsWith("/ops");
    const isOpsApiRoute = pathname.startsWith("/api/ops");

    if (!isOpsRoute && !isOpsApiRoute) {
        return NextResponse.next();
    }

    // 3. Check Session
    const sessionCookie = request.cookies.get("vayva_ops_session");

    if (!sessionCookie) {
        // If API -> 401 Unauthorized
        if (isOpsApiRoute) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // If UI -> Redirect to Login with `next` param
        const loginUrl = new URL("/ops/login", request.url);
        // Don't add next if it's just /ops or meaningless
        if (pathname !== "/ops") {
            loginUrl.searchParams.set("next", pathname);
        }
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Match ops routes and API routes
    matcher: ["/ops/:path*", "/api/ops/:path*"],
};
