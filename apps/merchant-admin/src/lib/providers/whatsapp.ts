
export class WhatsAppProvider {
    private static baseUrl = "https://graph.facebook.com/v17.0";

    static async sendMessage(to: string, text: string) {
        const token = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_ID;

        if (!token || !phoneId) {
            throw new Error("Missing WhatsApp configuration (WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_ID)");
        }

        const response = await fetch(`${this.baseUrl}/${phoneId}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { preview_url: false, body: text }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "WhatsApp API request failed");
        }

        return await response.json();
    }
}
