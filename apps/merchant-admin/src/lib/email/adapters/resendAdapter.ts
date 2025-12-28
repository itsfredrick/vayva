
import { Resend } from 'resend';
import { EmailAdapter, EmailPayload, EmailResult } from '../types';
import { getRouteForTemplate } from '../sender-routing';

/**
 * PRODUCTION-READY RESEND ADAPTER
 * Implements strict constraints:
 * - 4 Sender Slots
 * - Reply-To Rules
 * - Text Version Generation
 * - X-Vayva Headers
 */
export class ResendAdapter implements EmailAdapter {
    private client: Resend;

    constructor() {
        if (!process.env.RESEND_API_KEY) {
            console.warn('[ResendAdapter] Missing RESEND_API_KEY. Emails will fail if not mocked.');
        }
        this.client = new Resend(process.env.RESEND_API_KEY);
    }

    async send(payload: EmailPayload): Promise<EmailResult> {
        try {
            // 1. Resolve Sender Logic
            // If templateKey is missing, we default to 'system_maintenance' routing (Safety)
            const routing = getRouteForTemplate(payload.templateKey || 'system_maintenance');

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
                    { name: 'category', value: payload.templateKey || 'unknown' },
                    { name: 'env', value: process.env.NODE_ENV || 'development' }
                ],
                headers: {
                    'X-Vayva-Template-Key': payload.templateKey || 'unknown',
                    'X-Vayva-Environment': process.env.NODE_ENV || 'development',
                }
            };

            // 4. Send via Resend
            const { data, error } = await this.client.emails.send(resendPayload);

            if (error) {
                console.error('[ResendAdapter] API Error:', error);
                return { success: false, error: error.message };
            }

            return {
                success: true,
                providerId: data?.id
            };

        } catch (e: any) {
            console.error('[ResendAdapter] Exception:', e);
            return { success: false, error: e.message };
        }
    }

    private stripHtml(html: string): string {
        if (!html) return '';
        // Basic regex strip - sufficient for "Launch-Grade" text/plain generation
        // Replaces common block tags with newlines first
        let text = html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<\/tr>/gi, '\n')
            .replace(/<\/li>/gi, '\n');

        // Strip remaining tags
        text = text.replace(/<[^>]+>/g, '');

        // Decode common entities
        text = text
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');

        // Trim whitespace
        return text.split('\n').map(line => line.trim()).filter(line => line).join('\n');
    }
}
