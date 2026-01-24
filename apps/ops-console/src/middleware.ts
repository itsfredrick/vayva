import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // Ops Console Helper Cookie (Simulated for this internal tool)
    // In production, this would verify a signed JWT or session cookie
    const token = req.cookies.get('ops_session');

    const { pathname } = req.nextUrl;

    // Allow static assets and auth paths
    if (
        pathname.startsWith('/signin') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname.includes('/favicon.ico') ||
        pathname === '/robots.txt'
    ) {
        return NextResponse.next();
    }

    // Redirect to signin if no session found
    if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = '/signin';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
