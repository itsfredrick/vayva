import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Allow requests for:
    // 1. Auth related paths (signin, signup, error)
    // 2. Api auth routes
    // 3. Static assets and public icons/logos
    if (
        pathname.startsWith('/signin') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/auth') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname.includes('/vayva-logo-official.svg') ||
        pathname.includes('/favicon') ||
        pathname.includes('/icons/') ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return NextResponse.next();
    }

    // Redirect to signin if no token and accessing protected route
    if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = '/signin';
        // Add callbackUrl if we want to redirect back after login
        // url.searchParams.set('callbackUrl', encodeURI(pathname));
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
