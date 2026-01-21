// Wrapper for Evolution API (Self-Hosted WhatsApp Gateway)
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "global-api-key";
export class WhatsappManager {
    static async createInstance(instanceName) {
        try {
            const res = await fetch(`${EVOLUTION_API_URL}/instance/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": EVOLUTION_API_KEY
                },
                body: JSON.stringify({
                    instanceName,
                    token: instanceName, // Simplification
                    qrcode: true
                })
            });
            return await res.json();
        }
        catch (error) {
            console.error("Failed to create WhatsApp instance:", error);
            throw error;
        }
    }
    static async connectInstance(instanceName) {
        try {
            // In Evolution API, connect usually fetches QR
            const res = await fetch(`${EVOLUTION_API_URL}/instance/connect/${instanceName}`, {
                method: "GET",
                headers: { "apikey": EVOLUTION_API_KEY }
            });
            if (!res.ok)
                throw new Error("Failed to connect instance");
            return await res.json();
        }
        catch (error) {
            console.error("Failed to connect WhatsApp instance:", error);
            throw error;
        }
    }
    static async sendMessage(instanceName, phone, text) {
        try {
            // Standardize phone (remove +, ensure 234)
            const cleanPhone = phone.replace(/\D/g, "");
            const res = await fetch(`${EVOLUTION_API_URL}/message/sendText/${instanceName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": EVOLUTION_API_KEY
                },
                body: JSON.stringify({
                    number: cleanPhone,
                    options: { delay: 1200, presence: "composing" },
                    textMessage: { text }
                })
            });
            if (!res.ok)
                throw new Error("Failed to send message: " + res.statusText);
            return await res.json();
        }
        catch (error) {
            console.error(`Failed to send WA message to ${phone}:`, error);
            throw error;
        }
    }
}
