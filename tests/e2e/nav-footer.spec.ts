import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Header and Footer
 * 
 * These tests ensure that the canonical header and footer
 * remain visually consistent across changes.
 */

test.describe('Header and Footer Visual Regression', () => {
    test.beforeEach(async ({ page }) => {
        // Set consistent viewport
        await page.setViewportSize({ width: 1280, height: 720 });
    });

    test('Header snapshot - Desktop', async ({ page }) => {
        await page.goto('/');

        const header = page.locator('header');
        await expect(header).toBeVisible();

        // Take snapshot
        await expect(header).toHaveScreenshot('header-desktop.png', {
            maxDiffPixels: 100, // Allow minor anti-aliasing differences
        });
    });

    test('Footer snapshot - Desktop', async ({ page }) => {
        await page.goto('/');

        const footer = page.locator('footer');
        await expect(footer).toBeVisible();

        // Take snapshot
        await expect(footer).toHaveScreenshot('footer-desktop.png', {
            maxDiffPixels: 100,
        });
    });

    test('Header snapshot - Mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        const header = page.locator('header');
        await expect(header).toBeVisible();

        await expect(header).toHaveScreenshot('header-mobile.png', {
            maxDiffPixels: 100,
        });
    });

    test('Footer snapshot - Mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        const footer = page.locator('footer');
        await expect(footer).toBeVisible();

        await expect(footer).toHaveScreenshot('footer-mobile.png', {
            maxDiffPixels: 100,
        });
    });

    test('Header navigation structure', async ({ page }) => {
        await page.goto('/');

        // Verify Product dropdown exists
        const productNav = page.getByRole('button', { name: 'Product' });
        await expect(productNav).toBeVisible();

        // Verify Company dropdown exists
        const companyNav = page.getByRole('button', { name: 'Company' });
        await expect(companyNav).toBeVisible();

        // Verify Support dropdown exists
        const supportNav = page.getByRole('button', { name: 'Support' });
        await expect(supportNav).toBeVisible();

        // Verify CTAs exist
        const signIn = page.getByRole('link', { name: 'Sign in' });
        await expect(signIn).toBeVisible();

        const createAccount = page.getByRole('link', { name: 'Create account' });
        await expect(createAccount).toBeVisible();
    });

    test('Footer structure and links', async ({ page }) => {
        await page.goto('/');

        // Verify footer sections exist
        const productSection = page.locator('footer').getByText('Product');
        await expect(productSection).toBeVisible();

        const companySection = page.locator('footer').getByText('Company');
        await expect(companySection).toBeVisible();

        const supportSection = page.locator('footer').getByText('Support');
        await expect(supportSection).toBeVisible();

        const legalSection = page.locator('footer').getByText('Legal & Compliance');
        await expect(legalSection).toBeVisible();

        // Verify newsletter section
        const newsletter = page.locator('footer').getByText('Stay updated');
        await expect(newsletter).toBeVisible();

        // Verify copyright
        const copyright = page.locator('footer').getByText('© 2025 Vayva Inc. Built for Africa.');
        await expect(copyright).toBeVisible();
    });
});
