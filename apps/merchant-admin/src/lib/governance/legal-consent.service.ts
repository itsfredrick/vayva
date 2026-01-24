import { prisma } from "@vayva/db";
export class LegalConsentService {
    /**
     * Grant AI Consent for a store
     */
    static async grantConsent(storeId: any, version: any) {
        return await prisma.store.update({
            where: { id: storeId },
            data: {
                aiConsentVersion: version,
                aiAgencyStatus: "ACTIVE",
            },
        });
    }
    /**
     * Revoke AI Consent for a store
     */
    static async revokeConsent(storeId: any) {
        return await prisma.store.update({
            where: { id: storeId },
            data: {
                aiAgencyStatus: "INACTIVE",
            },
        });
    }
    /**
     * Get the correct AI disclosure copy for a buyer
     */
    static getBuyerDisclosure(channel: any) {
        if (channel === "WHATSAPP") {
            return "Vayva AI Assistant (on behalf of Merchant). I can help with products and orders.";
        }
        return "You're speaking with our AI Assistant. Type 'human' at any time to speak with the team.";
    }
    /**
     * Verify if AI is legally allowed to respond
     */
    static async canAIRespond(storeId: any) {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { aiAgencyStatus: true },
        });
        return store?.aiAgencyStatus === "ACTIVE";
    }
}
