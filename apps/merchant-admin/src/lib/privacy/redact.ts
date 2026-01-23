import { createHash } from "crypto";
export function redactPhone(phone: unknown) {
    if (!phone || phone.length < 4)
        return "***";
    return `${phone.substring(0, 3)}****${phone.slice(-3)}`;
}
export function redactEmail(email: unknown) {
    const [local, domain] = email.split("@");
    if (!domain)
        return "***";
    return `${local.substring(0, 2)}***@${domain}`;
}
export function hashIdentifier(value: unknown) {
    return createHash("sha256").update(value).digest("hex");
}
export function sanitizeObject(obj: unknown, piiFields: unknown= ["password", "token", "secret", "key"]) {
    if (!obj)
        return obj;
    const clean = { ...obj };
    for (const key of Object.keys(clean)) {
        if (piiFields.some((field: unknown) => key.toLowerCase().includes(field))) {
            clean[key] = "[REDACTED]";
        }
        else if (typeof clean[key] === "object") {
            clean[key] = sanitizeObject(clean[key], piiFields);
        }
    }
    return clean;
}
