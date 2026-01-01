import { WhatsAppProvider, SendMessageOptions } from "./interface";
import axios from "axios";

export class MetaProvider implements WhatsAppProvider {
  async sendMessage(
    options: SendMessageOptions,
  ): Promise<{ providerMessageId: string }> {
    const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    try {
      const response = await axios.post(
        url,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: options.recipient,
          type: "text", // Simplify for now
          text: { body: options.body || "Hello" }
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        providerMessageId: response.data.messages[0].id,
      };
    } catch (error: any) {
      console.error("[MetaProvider] Send Failed:", error.response?.data || error.message);
      throw new Error(`WhatsApp Send Failed: ${error.message}`);
    }
  }

  async syncTemplates(): Promise<void> {
    // Real sync logic to be implemented
    // console.log(`[MetaProvider] Syncing templates...`);
  }
}
