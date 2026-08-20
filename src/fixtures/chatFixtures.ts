import { test as base, request as playwrightRequest } from '@playwright/test';
import { ChatPage } from '@pages/ChatPage';
import { OpenWebUIClient } from '@api/OpenWebUIClient';

type ChatFixtures = {
  chatPage: ChatPage;
};

type WorkerFixtures = {
  apiClient: OpenWebUIClient;
};

export const test = base.extend<ChatFixtures, WorkerFixtures>({
  chatPage: async ({ page }, use) => {
    await use(new ChatPage(page));
  },

  apiClient: [async ({}, use) => {
    const { BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    const context = await playwrightRequest.newContext();
    const client = new OpenWebUIClient(context, BASE_URL!);
    await client.authenticate(ADMIN_EMAIL!, ADMIN_PASSWORD!);
    await use(client);
    await context.dispose();
  }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';
