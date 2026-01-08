import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";

export class LegalConsentService {
  /**
   * Grant AI Consent for a store
   */
  static async grantConsent(storeId: string, version: string) {
    return await prisma.store.update({
      where: { id: storeId },
      data: {
        aiConsentGivenAt: new Date(),
        aiConsentRevokedAt: null,
        aiConsentVersion: version,
        aiAgencyStatus: "ACTIVE",
      },
    });
  }

  /**
   * Revoke AI Consent for a store
   */
  static async revokeConsent(storeId: string) {
    return await prisma.store.update({
      where: { id: storeId },
      data: {
        aiConsentRevokedAt: new Date(),
        aiAgencyStatus: "INACTIVE",
      },
    });
  }

  /**
   * Get the correct AI disclosure copy for a buyer
   */
  static getBuyerDisclosure(channel: "WHATSAPP" | "WEBCHAT"): string {
    if (channel === "WHATSAPP") {
      return "Vayva AI Assistant (on behalf of Merchant). I can help with products and orders.";
    }
    return "You're speaking with our AI Assistant. Type 'human' at any time to speak with the team.";
  }

  /**
   * Verify if AI is legally allowed to respond
   */
  static async canAIRespond(storeId: string): Promise<boolean> {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { aiAgencyStatus: true, aiConsentGivenAt: true },
    });

    return store?.aiAgencyStatus === "ACTIVE" && !!store.aiConsentGivenAt;
  }
}
