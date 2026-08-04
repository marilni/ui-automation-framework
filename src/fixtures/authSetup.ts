import { chromium } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const AUTH_FILE = path.resolve('playwright/.auth/user.json');

async function globalSetup() {
  const { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file.');
  }

  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: 'playwright-report/', size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();

  const baseUrl = BASE_URL!.replace(/\/$/, '');

  await page.goto(`${baseUrl}/auth`);

  await page.getByPlaceholder(/email/i).fill(ADMIN_EMAIL);
  await page.getByPlaceholder(/password/i).fill(ADMIN_PASSWORD);
  await page.getByPlaceholder(/password/i).press('Enter');

  await page.waitForURL(`${baseUrl}/`, { timeout: 30000 }).catch(async () => {
    await page.screenshot({ path: 'playwright-report/auth-failure.png', fullPage: true });
    throw new Error(`Auth failed. Current URL: ${page.url()}`);
  });

  await context.storageState({ path: AUTH_FILE });
  await browser.close();
}

export default globalSetup;
