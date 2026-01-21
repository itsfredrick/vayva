import axios from "axios";
export class MetaProvider {
    constructor() {
        this.apiToken = process.env.WHATSAPP_API_TOKEN || "";
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
        this.version = "v18.0";
    }
    async sendMessage(options) {
        if (!this.apiToken || !this.phoneNumberId) {
            console.warn("[MetaProvider] Missing credentials, simulating send.");
            return { providerMessageId: `sim_${Date.now()}` };
        }
        const url = `https://graph.facebook.com/${this.version}/${this.phoneNumberId}/messages`;
        let payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: options.recipient,
            type: options.type,
        };
        if (options.type === "text") {
            payload.text = { body: options.body };
        }
        else if (options.type === "template") {
            payload.template = {
                name: options.templateName,
                language: { code: options.language || "en_US" },
                components: options.components || [],
            };
        }
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${this.apiToken}`,
                    "Content-Type": "application/json",
                },
            });
            return {
                providerMessageId: response.data.messages[0].id,
            };
        }
        catch (error) {
            console.error("[MetaProvider] Send failed:", error.response?.data || error.message);
            throw new Error("Failed to send WhatsApp message");
        }
    }
}
