import DOMPurify from "isomorphic-dompurify";

/**
 * Standard configuration for rich text sanitization
 */
const DEFAULT_CONFIG = {
    ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
};

/**
 * Sanitizes a string containing HTML to prevent XSS.
 * Use this for product descriptions, messaging templates, and policies.
 */
export function sanitizeHTML(html: string, options = DEFAULT_CONFIG): string {
    if (!html) return '';
    return DOMPurify.sanitize(html, options);
}

/**
 * Normalizes and whitelists user-supplied URLs to prevent SSRF and Open Redirects.
 */
export function validateRedirectURL(url: string, allowedDomains: string[] = ['vayva.ng', 'vayva.com']): string | null {
    if (!url) return null;

    try {
        const parsed = new URL(url);

        // Block non-HTTP protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) return null;

        // Check against whitelist or allow relative paths
        const isAllowedDomain = allowedDomains.some(domain =>
            parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
        );

        if (isAllowedDomain) return url;

        return null;
    } catch {
        // If it's a relative path starting with /, it's safe
        if (url.startsWith('/') && !url.startsWith('//')) {
            return url;
        }
        return null;
    }
}
