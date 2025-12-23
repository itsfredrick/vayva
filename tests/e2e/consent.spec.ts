import { test, expect } from './setup';

test.describe('Consent & Preferences Flow', () => {
    const customerPhone = '08011112222'; // Will be normalized to +2348011112222
    const normalizedPhone = '+2348011112222';

    // 1. Checkout Opt-In
    test.skip('checkout opt-in creates consent record', async ({ request }) => {
        // SKIPPED: API endpoint not implemented yet
        // TODO: Implement /api/storefront/checkout/consent endpoint
    });

    // 2. Preferences Page access
    test.skip('can access preferences page with token', async ({ request, page }) => {
        // SKIPPED: Webhook endpoint not implemented yet
        // TODO: Implement /api/whatsapp/webhook/inbound endpoint
    });
});
