import { NextResponse, type NextRequest } from 'next/server';
import { resolveRequest } from '@/lib/routing/tenant-engine';

// Simple In-Memory Rate Limit Store (Note: Ephemeral per lambda instance)
const rateLimit = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 Minute
const API_LIMIT = 300; // 300 req/min
const AUTH_LIMIT = 20; // 20 req/min

// TODO: In production, move this to a Redis fetch or Edge Config.
// For now, we use a static map or a fast-cached fetch to avoid blocking.
const getTenantMap = async () => ({
    'bloom': 'tenant_bloom_001',
    'gizmo': 'tenant_gizmo_002',
    'standard': 'vayva-standard-id',
});

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const path = request.nextUrl.pathname;
    const query = Object.fromEntries(request.nextUrl.searchParams);

    // 0. Tenant Resolution (AntiGravity Engine)
    // Skip resolution for static assets and internal Next.js routes
    const isPublicAsset = path.startsWith('/_next') || path.startsWith('/favicon.ico') || path.startsWith('/images');

    if (!isPublicAsset) {
        const tenantMap = await getTenantMap();
        const resolution = resolveRequest({
            hostname,
            path,
            query,
            tenantMap,
            env: process.env.NODE_ENV || 'development'
        });

        if (resolution.action === 'rewrite' && resolution.destination) {
            return NextResponse.rewrite(new URL(resolution.destination, request.url));
        }

        if (resolution.action === 'redirect' && resolution.destination) {
            return NextResponse.redirect(new URL(resolution.destination, request.url));
        }

        if (resolution.action === 'not_found' && resolution.destination) {
            // Rewrite to a custom error page rather than a hard 404
            return NextResponse.rewrite(new URL(resolution.destination, request.url));
        }
    }

    const response = NextResponse.next();
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    // 1. Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

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
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);

    // 2. Rate Limiting (API & Auth)
    if (path.startsWith('/api/') || path.startsWith('/signin') || path.startsWith('/signup') || path.startsWith('/login')) {
        const isAuth = path.includes('/auth') || path.startsWith('/signin') || path.startsWith('/login') || path.startsWith('/signup');
        const limit = isAuth ? AUTH_LIMIT : API_LIMIT;

        const key = `${ip}:${isAuth ? 'auth' : 'api'}`;
        const now = Date.now();
        const record = rateLimit.get(key) || { count: 0, lastReset: now };

        if (now - record.lastReset > RATE_LIMIT_WINDOW) {
            record.count = 0;
            record.lastReset = now;
        }

        record.count++;
        rateLimit.set(key, record);

        response.headers.set('X-RateLimit-Limit', limit.toString());
        response.headers.set('X-RateLimit-Remaining', Math.max(0, limit - record.count).toString());

        if (record.count > limit) {
            return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': '0',
                    'Retry-After': '60'
                }
            });
        }
    }

    // 3. Auth Guard (Merchant Admin)
    const protectedPaths = ['/admin', '/onboarding', '/dashboard', '/settings', '/control-center'];
    const isProtected = protectedPaths.some(p => path.startsWith(p));

    if (isProtected) {
        // Check for both legacy NextAuth and our new Custom Session
        const token = request.cookies.get('vayva_session') ||
            request.cookies.get('next-auth.session-token') ||
            request.cookies.get('__Secure-next-auth.session-token');

        if (!token) {
            const url = request.nextUrl.clone();
            // Redirect to signin if not marketing landing or public routes
            url.pathname = '/signin';
            url.searchParams.set('callbackUrl', path);
            return NextResponse.redirect(url);
        }
    }

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
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
