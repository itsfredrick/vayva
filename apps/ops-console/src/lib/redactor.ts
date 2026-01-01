
const SENSITIVE_PATTERNS = [
    // Bearer Tokens
    /(Bearer\s+)[a-zA-Z0-9\._\-]{20,}/gi,
    // API Keys (General)
    /(key-|api-key-|sk-)[a-zA-Z0-9]{20,}/gi,
    // Paystack/Stripe Secret Keys
    /(sk_test_|sk_live_)[a-zA-Z0-9]{20,}/gi,
    // Passwords in JSON
    /("password"\s*:\s*")[^"]+(")/gi,
    // Basic Auth
    /(Basic\s+)[a-zA-Z0-9+/=]{10,}/gi,
];

export function redactSensitiveData(text: string): string {
    if (!text) return text;

    let redacted = text;
    for (const pattern of SENSITIVE_PATTERNS) {
        redacted = redacted.replace(pattern, (match, p1, p2) => {
            // If we have capture groups (like for password JSON), preserve the surrounding structure
            if (p1 && p2) {
                return `${p1}********${p2}`;
            }
            // For simple matches, preserve the prefix (like "Bearer ") and redact the rest
            if (p1) {
                return `${p1}********`;
            }
            return "********";
        });
    }

    return redacted;
}
