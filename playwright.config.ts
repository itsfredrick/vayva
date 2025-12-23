import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 120 * 1000, // Increased from 60s to 120s for complex flows
    expect: {
        timeout: 10 * 1000
    },
    fullyParallel: false, // Sequential for Golden Path to avoid state collisions
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // One worker to ensure sequential execution of the golden path
    reporter: [['html'], ['list']],
    use: {
        actionTimeout: 0,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        baseURL: 'http://localhost:3000',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'pnpm dev --filter=merchant-admin',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
        env: {
            DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vayva_test?schema=public',
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'test-secret-min-32-chars-long-for-ci',
            NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        },
    },
});
