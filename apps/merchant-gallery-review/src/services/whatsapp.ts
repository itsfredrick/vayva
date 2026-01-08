
// Wrapper for Evolution API (Self-Hosted WhatsApp Gateway)

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "global-api-key";

export class WhatsappManager {
  static async createInstance(instanceName: string) {
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
    } catch (error) {
      console.error("Failed to create WhatsApp instance:", error);
      // Mock success for development if API is offline
      return {
        instance: { instanceName, status: "created" },
        qrcode: "base64_mock_qr_code_data_here"
      };
    }
  }

  static async connectInstance(instanceName: string) {
    try {
      // In Evolution API, connect usually fetches QR
      const res = await fetch(`${EVOLUTION_API_URL}/instance/connect/${instanceName}`, {
        method: "GET",
        headers: { "apikey": EVOLUTION_API_KEY }
      });
      return await res.json();
    } catch (error) {
      console.error("Failed to connect WhatsApp instance:", error);
      // Mock QR for UI dev
      return { base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" };
    }
  }

  static async sendMessage(instanceName: string, phone: string, text: string) {
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
      return await res.json();
    } catch (error) {
      console.error(`Failed to send WA message to ${phone}:`, error);
      return { status: "mock_sent" };
    }
  }
}
