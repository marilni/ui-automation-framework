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
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${BASE_URL}auth`);

  await page.getByPlaceholder(/email/i).fill(ADMIN_EMAIL);
  await page.getByPlaceholder(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL(`${BASE_URL}`, { timeout: 15000 });

  await context.storageState({ path: AUTH_FILE });
  await browser.close();
}

export default globalSetup;
