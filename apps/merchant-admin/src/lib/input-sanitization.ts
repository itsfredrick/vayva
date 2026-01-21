/**
 * Input Sanitization Utility
 * Prevents XSS attacks, SQL injection, and other security vulnerabilities
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes script tags, event handlers, and dangerous attributes
 */
export function sanitizeHtml(input: string): string {
    if (!input) return '';

    return input
        // Remove script tags and content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Remove data: protocol (can be used for XSS)
        .replace(/data:text\/html/gi, '')
        // Remove dangerous tags
        .replace(/<(iframe|object|embed|link|meta|base)[^>]*>/gi, '');
}

/**
 * Sanitize plain text input
 * Removes all HTML tags and special characters that could be used for XSS
 */
export function sanitizeText(input: string): string {
    if (!input) return '';

    return input
        // Remove all HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove null bytes
        .replace(/\0/g, '')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Sanitize email address
 * Validates and normalizes email format
 */
export function sanitizeEmail(email: string): string {
    if (!email) return '';

    return email
        .toLowerCase()
        .trim()
        .replace(/[<>]/g, ''); // Remove angle brackets
}

/**
 * Sanitize URL
 * Ensures URL is safe and uses allowed protocols
 */
export function sanitizeUrl(url: string, allowedProtocols: string[] = ['http', 'https']): string {
    if (!url) return '';

    try {
        const parsed = new URL(url);

        // Check if protocol is allowed
        const protocol = parsed.protocol.replace(':', '');
        if (!allowedProtocols.includes(protocol)) {
            return '';
        }

        return parsed.toString();
    } catch {
        // Invalid URL
        return '';
    }
}

/**
 * Sanitize phone number
 * Removes all non-numeric characters except + at the start
 */
export function sanitizePhoneNumber(phone: string): string {
    if (!phone) return '';

    // Keep only digits and + at the start
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Ensure + is only at the start
    if (cleaned.startsWith('+')) {
        return '+' + cleaned.slice(1).replace(/\+/g, '');
    }

    return cleaned.replace(/\+/g, '');
}

/**
 * Sanitize numeric input
 * Ensures input is a valid number within optional bounds
 */
export function sanitizeNumber(
    input: string | number,
    options?: { min?: number; max?: number; decimals?: number }
): number | null {
    const num = typeof input === 'string' ? parseFloat(input) : input;

    if (isNaN(num) || !isFinite(num)) {
        return null;
    }

    let sanitized = num;

    // Apply bounds
    if (options?.min !== undefined && sanitized < options.min) {
        sanitized = options.min;
    }
    if (options?.max !== undefined && sanitized > options.max) {
        sanitized = options.max;
    }

    // Apply decimal precision
    if (options?.decimals !== undefined) {
        sanitized = parseFloat(sanitized.toFixed(options.decimals));
    }

    return sanitized;
}

/**
 * Sanitize object keys and string values
 * Recursively sanitizes all string values in an object
 */
export function sanitizeObject<T extends Record<string, any>>(
    obj: T,
    sanitizer: (value: string) => string = sanitizeText
): T {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizer(value);
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'string' ? sanitizer(item) : item
            );
        } else if (value && typeof value === 'object') {
            sanitized[key] = sanitizeObject(value, sanitizer);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as T;
}

/**
 * Sanitize filename
 * Removes path traversal attempts and dangerous characters
 */
export function sanitizeFilename(filename: string): string {
    if (!filename) return '';

    return filename
        // Remove path traversal
        .replace(/\.\./g, '')
        .replace(/[\/\\]/g, '')
        // Remove null bytes
        .replace(/\0/g, '')
        // Remove control characters
        .replace(/[\x00-\x1f\x80-\x9f]/g, '')
        // Remove dangerous characters
        .replace(/[<>:"|?*]/g, '')
        .trim();
}

/**
 * Sanitize SQL-like input (for search queries, etc.)
 * Prevents SQL injection attempts
 */
export function sanitizeSqlInput(input: string): string {
    if (!input) return '';

    return input
        // Remove SQL comments
        .replace(/--/g, '')
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '')
        // Remove semicolons (statement terminators)
        .replace(/;/g, '')
        // Remove common SQL keywords that shouldn't be in user input
        .replace(/\b(DROP|DELETE|INSERT|UPDATE|UNION|EXEC|EXECUTE)\b/gi, '')
        .trim();
}

/**
 * Validate and sanitize JSON input
 * Safely parses JSON and sanitizes string values
 */
export function sanitizeJson<T = any>(
    input: string,
    sanitizer: (value: string) => string = sanitizeText
): T | null {
    try {
        const parsed = JSON.parse(input);

        if (typeof parsed === 'object' && parsed !== null) {
            return sanitizeObject(parsed, sanitizer);
        }

        return parsed;
    } catch {
        return null;
    }
}

/**
 * Comprehensive sanitization for form data
 * Applies appropriate sanitization based on field type
 */
export function sanitizeFormData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) {
            sanitized[key] = value;
            continue;
        }

        // Determine sanitization based on field name/type
        if (key.toLowerCase().includes('email')) {
            sanitized[key] = sanitizeEmail(String(value));
        } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) {
            sanitized[key] = sanitizeUrl(String(value));
        } else if (key.toLowerCase().includes('phone')) {
            sanitized[key] = sanitizePhoneNumber(String(value));
        } else if (key.toLowerCase().includes('html') || key.toLowerCase().includes('content')) {
            sanitized[key] = sanitizeHtml(String(value));
        } else if (typeof value === 'string') {
            sanitized[key] = sanitizeText(value);
        } else if (typeof value === 'number') {
            sanitized[key] = sanitizeNumber(value);
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'string' ? sanitizeText(item) : item
            );
        } else if (typeof value === 'object') {
            sanitized[key] = sanitizeFormData(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Escape HTML entities for safe display
 * Use this when displaying user content in HTML
 */
export function escapeHtml(input: string): string {
    if (!input) return '';

    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };

    return input.replace(/[&<>"'\/]/g, char => htmlEntities[char]);
}
