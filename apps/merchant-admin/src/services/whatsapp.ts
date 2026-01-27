// Wrapper for Evolution API (Self-Hosted WhatsApp Gateway)
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "global-api-key";
export class WhatsappManager {
    static async createInstance(instanceName: any) {
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
        catch (error: any) {
            console.error("Failed to create WhatsApp instance:", error);
            throw error;
        }
    }
    static async connectInstance(instanceName: any) {
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
        catch (error: any) {
            console.error("Failed to connect WhatsApp instance:", error);
            throw error;
        }
    }
    static async sendMessage(instanceName: any, phone: any, text: any) {
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
        catch (error: any) {
            console.error(`Failed to send WA message to ${phone}:`, error);
            throw error;
        }
    }

    static async getPairingCode(instanceName: any, phoneNumber: string) {
        try {
            const cleanPhone = phoneNumber.replace(/\D/g, "");
            const res = await fetch(`${EVOLUTION_API_URL}/instance/connect/${instanceName}/phonenumber`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": EVOLUTION_API_KEY
                },
                body: JSON.stringify({
                    phoneNumber: cleanPhone
                })
            });
            if (!res.ok)
                throw new Error("Failed to get pairing code: " + res.statusText);

            // Expected response: { pairingCode: "ABCD-1234", ... }
            return await res.json();
        }
        catch (error: any) {
            console.error("Failed to get pairing code:", error);
            throw error;
        }
    }

    static async getBase64FromMediaMessage(instanceName: string, messageKey: any) {
        const res = await fetch(`${EVOLUTION_API_URL}/chat/getBase64FromMediaMessage/${instanceName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": EVOLUTION_API_KEY
            },
            body: JSON.stringify({
                message: {
                    key: {
                        id: messageKey?.id,
                        remoteJid: messageKey?.remoteJid,
                        fromMe: Boolean(messageKey?.fromMe),
                        participant: messageKey?.participant,
                    },
                },
            })
        });
        const data = await res.json().catch(async () => ({ raw: await res.text() }));
        if (!res.ok) {
            throw new Error((data as any)?.error?.message || (data as any)?.message || "Failed to fetch base64 media");
        }
        return data;
    }

    static async getMediaDataUrlFromMessage(instanceName: string, messageKey: any, fallbackMimeType?: string) {
        const data: any = await this.getBase64FromMediaMessage(instanceName, messageKey);
        const base64 = data?.base64 || data?.media?.base64 || data?.message?.base64 || data?.data || "";
        const mimeType = data?.mimetype || data?.mimeType || fallbackMimeType || "application/octet-stream";
        if (!base64 || typeof base64 !== "string") {
            throw new Error("No base64 returned by Evolution");
        }
        const cleaned = base64.includes(",") ? base64.split(",").pop() : base64;
        return `data:${mimeType};base64,${cleaned}`;
    }
}
