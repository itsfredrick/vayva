import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {

    test('login page renders correctly', async ({ page }) => {
        await page.goto('/signin');
        await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();
    });

    test('signup page renders correctly', async ({ page }) => {
        await page.goto('/signup');
        await expect(page.getByRole('heading', { name: /Create account/i })).toBeVisible();
    });

    test('protected route redirects to login', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/.*signin.*/); // Changed from login to signin
    });

});
