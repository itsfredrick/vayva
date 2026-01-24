import { Resend } from "resend";

export class ResendAdapter {
    private _client: Resend;

    constructor(apiKey: string) {
        if (!apiKey) {
            console.warn("[ResendAdapter] Missing RESEND_API_KEY. Emails will fail.");
        }
        this._client = new Resend(apiKey);
        return this; // Constructor return override? Usually not needed but kept if original pattern.
    }

    async send(params: any) {
        if (!this._client) return { success: false, error: "Client not initialized" };

        return this._client.emails.send({
            from: params.from,
            to: params.to,
            subject: params.subject,
            html: params.html,
            react: params.react
        });
    }
}
