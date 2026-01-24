import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host");

    // Get the hostname (e.g. demo.vayva.shop)
    // In dev, we can infer from a query param if needed, but for "Growth Architecture" we assume production routing.

    // 1. Redirect www to non-www (Canonical Hostname Enforcement)
    if (hostname?.includes("www.") && !hostname.includes("localhost")) {
        const newHost = hostname.replace("www.", "");
        return NextResponse.redirect(`https://${newHost}${url.pathname}${url.search}`, 301);
    }

    // 2. Rewrite for Custom Domains (Stub for future architecture)
    // If we were doing multi-tenant rewrites (e.g. app.vayva.ng vs store.vayva.ng), it would go here.
    // For now, since apps/storefront is DEDICATED, we just pass through.

    return NextResponse.next();
}
