
import { test, expect } from '@playwright/test';
import { AnalyticsService } from '../../apps/merchant-admin/src/lib/analytics/analyticsService';
import { prisma } from '@vayva/db';

test.describe('Analytics System', () => {

    test('can ingest event via service', async () => {
        const merchantId = 'test_ana_merch';

        await AnalyticsService.trackEvent({
            merchantId,
            eventName: 'page_view',
            visitorId: 'vis_123',
            path: '/home'
        });

        const evt = await prisma.analyticsEvent.findFirst({
            where: { merchantId, eventName: 'page_view' },
            orderBy: { createdAt: 'desc' }
        });

        expect(evt).toBeTruthy();
        expect(evt?.visitorId).toBe('vis_123');
    });

    // API test omitted, relying on service test + dashboard visual

    test('merchant dashboard shows analytics', async ({ page }) => {
        await page.goto('/dashboard/analytics');
        await expect(page.getByText('Analytics 📊')).toBeVisible();
        await expect(page.getByText('Total Visitors')).toBeVisible();
    });

});
