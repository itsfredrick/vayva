import { test, expect } from '@playwright/test';
import { prisma } from '@vayva/db';

const MERCHANT_USER = { email: 'merchant@test.com', password: 'password123', storeId: 'store_dev_pilot' };
const OPS_USER = { email: 'ops@vayva.com', password: 'password123', role: 'ADMIN' };

test.describe('Support Bot & Ops Console Regression', () => {

    test.beforeAll(async () => {
        // Seed minimal data if needed, or rely on staged env
        // Ensure store_dev_pilot exists
    });

    test('1. Merchant receives bot reply + messageId', async ({ page }) => {
        // Login as merchant
        await page.goto('/login');
        // ... fill login ... (Simplified for this snippet, assume authenticated session)

        await page.goto('/admin/dashboard');
        await page.click('button[aria-label="Open Support"]'); // Selector for chat bubble

        await page.fill('input[placeholder="Ask for help..."]', 'Hello bot');
        await page.click('button:has(svg.lucide-send)');

        // Expect bot reply bubble
        await expect(page.locator('.bg-white.text-gray-800').first()).toBeVisible();
        // Verify thumbs up exists (implies messageId presence)
        await expect(page.locator('button[title="Solved my issue"]')).toBeVisible();
    });

    test('2. Feedback loop (Thumbs Up)', async ({ page, request }) => {
        // Re-use session or mock
        // Click thumbs up
        await page.click('button[title="Solved my issue"]');
        // Verify changed UI state
        await expect(page.locator('text=Marked as Solved')).toBeVisible();

        // Verification via DB or API interception
        // ...
    });

    test('3. Manual Escalation', async ({ page }) => {
        await page.click('button:has-text("Talk to Human")');
        await expect(page.locator('text=I\'m escalating this')).toBeVisible();

        // Verify ticket created in inbox
        await page.goto('/admin/inbox');
        await expect(page.locator('text=User explicitly requested human support')).toBeVisible();
    });

    test('5. Auto-escalation (Refund)', async ({ page }) => {
        await page.fill('input', 'I want a refund for the fraud order');
        await page.press('input', 'Enter');

        await expect(page.locator('text=escalating')).toBeVisible();
        // Verify DB handoff event trigger='PAYMENT_DISPUTE'
    });

    test('6. Rate Limit (429)', async ({ page }) => {
        // Spam messages
        for (let i = 0; i < 32; i++) {
            await page.fill('input', `spam ${i}`);
            await page.click('button:has(svg.lucide-send)');
            await page.waitForTimeout(100);
        }
        await expect(page.locator('text=Rate limit exceeded')).toBeVisible();
    });

});
