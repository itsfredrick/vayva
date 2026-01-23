import { Resend } from "resend";
import { getRouteForTemplate } from "../sender-routing";
/**
 * PRODUCTION-READY RESEND ADAPTER
 * Implements strict constraints:
 * - 4 Sender Slots
 * - Reply-To Rules
 * - Text Version Generation
 * - X-Vayva Headers
 */
export class ResendAdapter {
    constructor() {
        this._client = null;
        // Lazy init
    }
    get client() {
        if (!this._client) {
            const apiKey = process.env.RESEND_API_KEY;
            if (!apiKey) {
                console.warn("[ResendAdapter] Missing RESEND_API_KEY. Emails will fail.");
                // We can throw here or allow it to fail later. Throwing is safer for debugging but better to fail at send time.
            }
            this._client = new Resend(apiKey);
        }
        return this._client;
    }
    async send(payload) {
        try {
            // 1. Resolve Sender Logic
            // If templateKey is missing, we default to 'system_maintenance' routing (Safety)
            const routing = getRouteForTemplate(payload.templateKey || "system_maintenance");
            // 2. Generate Plaintext Version (Requirement G3)
            // Strip HTML tags for a clean text version
            const textContent = this.stripHtml(payload.html);
            // 3. Construct Resend Payload
            const resendPayload = {
                from: `${routing.sender.name} <${routing.sender.email}>`,
                to: payload.to,
                subject: payload.subject,
                html: payload.html,
                text: textContent,
                reply_to: routing.replyTo,
                tags: [
                    { name: "category", value: payload.templateKey || "unknown" },
                    { name: "env", value: process.env.NODE_ENV || "development" },
                ],
                headers: {
                    "X-Vayva-Template-Key": payload.templateKey || "unknown",
                    "X-Vayva-Environment": process.env.NODE_ENV || "development",
                },
            };
            // 4. Send via Resend
            const { data, error } = await this.client.emails.send(resendPayload);
            if (error) {
                console.error("[ResendAdapter] API Error:", error);
                return { success: false, error: error.message };
            }
            return {
                success: true,
                providerId: data?.id,
            };
        }
        catch (e) {
            console.error("[ResendAdapter] Exception:", e);
            return { success: false, error: e.message };
        }
    }
    stripHtml(html) {
        if (!html)
            return "";
        // Basic regex strip - sufficient for "Launch-Grade" text/plain generation
        // Replaces common block tags with newlines first
        let text = html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<\/div>/gi, "\n")
            .replace(/<\/tr>/gi, "\n")
            .replace(/<\/li>/gi, "\n");
        // Strip remaining tags
        text = text.replace(/<[^>]+>/g, "");
        // Decode common entities
        text = text
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
        // Trim whitespace
        return text
            .split("\n")
            .map((line: any) => line.trim())
            .filter((line: any) => line)
            .join("\n");
    }
}
