
export class EmailProvider {
    private static apiKey = process.env.RESEND_API_KEY;

    static async sendEmail(to: string, subject: string, html: string) {
        if (!this.apiKey) {
            throw new Error("Missing Email configuration (RESEND_API_KEY)");
        }

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Vayva <no-reply@vayva.ng>",
                to: [to],
                subject: subject,
                html: html
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Email API request failed");
        }

        return await response.json();
    }
}
