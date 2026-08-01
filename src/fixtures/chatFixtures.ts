import { test as base } from '@playwright/test';
import { ChatPage } from '@pages/ChatPage';

type ChatFixtures = {
  chatPage: ChatPage;
};

export const test = base.extend<ChatFixtures>({
  chatPage: async ({ page }, use) => {
    await use(new ChatPage(page));
  },
});

export { expect } from '@playwright/test';
