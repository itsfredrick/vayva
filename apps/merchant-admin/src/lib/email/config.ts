
export const SENDER_IDENTITIES = {
    SECURITY: { email: 'no-reply@vayva.ng', name: 'Vayva Security' },
    BILLING: { email: 'billing@vayva.ng', name: 'Vayva Billing' },
    TEAM: { email: 'team@vayva.ng', name: 'Vayva Team' },
    SUPPORT: { email: 'support@vayva.ng', name: 'Vayva Support' },
} as const;

export type SenderIdentity = typeof SENDER_IDENTITIES[keyof typeof SENDER_IDENTITIES];
export type SenderKey = keyof typeof SENDER_IDENTITIES;

export const REPLY_TO_ADDRESSES = {
    SUPPORT: 'support@vayva.ng',
    BILLING: 'billing@vayva.ng',
} as const;

/**
 * Enforces strict Reply-To rules based on the Sender Identity.
 * 
 * Rules:
 * - NO-REPLY -> Support
 * - TEAM -> Support
 * - SUPPORT -> Support
 * - BILLING -> Support (default)
 */
export function getReplyTo(senderEmail: string): string {
    switch (senderEmail) {
        case SENDER_IDENTITIES.SECURITY.email:
        case SENDER_IDENTITIES.TEAM.email:
        case SENDER_IDENTITIES.SUPPORT.email:
            return REPLY_TO_ADDRESSES.SUPPORT;
        case SENDER_IDENTITIES.BILLING.email:
            // Could strictly be billing, but prompt says "default Reply-To = support unless product requires billing inbox"
            // For MVP/Safest: Route to support.
            return REPLY_TO_ADDRESSES.SUPPORT;
        default:
            return REPLY_TO_ADDRESSES.SUPPORT;
    }
}
