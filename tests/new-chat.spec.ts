import { test, expect } from '../src/fixtures/chatFixtures';

test.describe('Chat @critical-path @ai-feature', () => {

  test('Input Visible On Load', async ({ chatPage }) => {
    await chatPage.goto();

    await expect(chatPage.chatContainer).toBeVisible();
    await expect(chatPage.messageInput).toBeVisible();
  });

  test('New Session Initialized', async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.openNewChat();

    expect(await chatPage.isChatInputReady()).toBe(true);
  });

});
