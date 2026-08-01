import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not set. Check your .env file.');
}

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file.');
}

export default defineConfig({
  testDir: './tests',
  globalSetup: './src/fixtures/authSetup',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  timeout: 60000,

  use: {
    baseURL: process.env.BASE_URL,
    storageState: 'playwright/.auth/user.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Critical Path',
      use: { ...devices['Desktop Chrome'] },
      grep: /@critical-path/,
    },
    {
      name: 'AI Features',
      use: { ...devices['Desktop Chrome'] },
      grep: /@ai-feature/,
    },
  ],
});
