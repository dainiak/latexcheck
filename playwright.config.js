import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:4173',
    },
    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
    ],
    webServer: {
        command: 'npx vite build && npx vite preview',
        port: 4173,
        reuseExistingServer: !process.env.CI,
    },
});
