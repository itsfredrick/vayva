
import { WhatsappManager } from "./whatsapp";

// Central Notification System
// Triggers WhatsApp messages on key events

export type NotificationEvent = "onboarding_complete" | "first_sale" | "kyc_verified" | "lead_hot";

interface MerchantData {
  name: string;
  phone: string;
  storeName?: string;
  storeSlug?: string;
}

export class NotificationService {
  // Vayva's own Notification Number (System Instance)
  private static SYSTEM_INSTANCE = "vayva_notifications";

  static async sendMilestone(event: NotificationEvent, data: MerchantData) {
    let message = "";

    switch (event) {
      case "onboarding_complete":
        message = `Welcome to Vayva, ${data.name}! 🚀\n\nYour store *${data.storeName}* is now live at https://${data.storeSlug}.vayva.ng.\n\nI am your AI Assistant—send me a message if you want to see how I help your customers! Check your dashboard at app.vayva.ng to see your first leads.`;
        break;
      case "first_sale":
        message = `Cha-ching! 💰\n\n${data.name}, you just made your FIRST sale on Vayva! Check your dashboard to process the order.`;
        break;
      case "kyc_verified":
        message = `Verified! ✅\n\nHi ${data.name}, your identity has been verified. Payouts are now active for your account.`;
        break;
    }

    if (message && data.phone) {
      // Fire and forget
      WhatsappManager.sendMessage(this.SYSTEM_INSTANCE, data.phone, message)
        .then(() => console.log(`[Notify] Sent ${event} to ${data.phone}`))
        .catch(e => console.error(`[Notify] Failed to send ${event}`, e));
    }
  }
}
