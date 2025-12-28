
import { SENDER_IDENTITIES, getReplyTo, SenderIdentity } from './config';

export interface RouteConfig {
    sender: SenderIdentity;
    replyTo: string;
}

// Maps specific Template Keys to Sender Configuration
const TEMPLATE_ROUTING: Record<string, SenderKey> = {
    // Auth & Security -> SECURITY (no-reply)
    'auth_otp_verification': 'SECURITY',
    'auth_password_reset': 'SECURITY',
    'auth_new_login': 'SECURITY',
    'auth_verify_email_link': 'SECURITY',
    'auth_account_locked': 'SECURITY',
    'auth_password_changed': 'SECURITY',

    // Lifecycle -> SECURITY (or TEAM? Prompt says "Auth/Security/System -> no-reply")
    // "onboarding_incomplete" is slightly "marketing/nudge", but often system generated.
    'auth_welcome': 'SECURITY', // "Welcome" is often system
    'onboarding_incomplete': 'SECURITY',

    // Team -> TEAM
    'team_invite': 'TEAM',

    // Billing -> BILLING
    'billing_receipt': 'BILLING',
    'billing_invoice_available': 'BILLING',
    'billing_payment_failed': 'BILLING',
    'billing_subscription_started': 'BILLING',
    'billing_subscription_cancelled': 'BILLING',
    'merchant_payout_processed': 'BILLING',

    // Orders (Customer Facing) -> SUPPORT (per prompt "Customer-service style -> support")
    // Or maybe TEAM/SYSTEM? Prompt says "Customer-service style... -> support"
    'order_confirmation_customer': 'SUPPORT',
    'order_shipped_customer': 'SUPPORT',
    'order_delivered_customer': 'SUPPORT',

    // Merchant Notifications -> SECURITY or TEAM?
    // "New Order" notification to merchant. usually system/no-reply.
    'merchant_new_order': 'SECURITY',

    // System -> SECURITY
    'system_maintenance': 'SECURITY',
};

type SenderKey = keyof typeof SENDER_IDENTITIES;

export function getRouteForTemplate(templateKey: string): RouteConfig {
    const senderKey = TEMPLATE_ROUTING[templateKey] || 'SECURITY'; // Fallback to SECURITY
    const sender = SENDER_IDENTITIES[senderKey];

    return {
        sender,
        replyTo: getReplyTo(sender.email),
    };
}

/**
 * Returns the full Routing Table for Audit purposes
 */
export function getFullRoutingTable() {
    return Object.keys(TEMPLATE_ROUTING).map(key => ({
        template_key: key,
        ...getRouteForTemplate(key)
    }));
}
