/**
 * BRAND CONFIGURATION - Monorepo Source of Truth
 */

export const BRAND = {
    name: "Vayva",
    domain: "vayva.ng",
    canonicalOrigin: process.env.VAYVA_CANONICAL_ORIGIN || "https://vayva.ng",
    supportEmail: "support@vayva.ng",
    helloEmail: "hello@vayva.ng",
} as const;


export function getCanonicalUrl(path: string = "") {
    const base = BRAND.canonicalOrigin.endsWith("/")
        ? BRAND.canonicalOrigin.slice(0, -1)
        : BRAND.canonicalOrigin;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    // In development, we might want to override this, 
    // but for emails it MUST be absolute and usually the production domain.
    return `${base}${normalizedPath}`;
}
