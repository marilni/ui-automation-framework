import { test, expect } from '../src/fixtures/chatFixtures';

test.describe('Chat: Input @critical-path', () => {

  test('Input Visible On Load', async ({ chatPage }) => {
    await chatPage.goto();

    await expect(chatPage.chatContainer).toBeVisible();
    await expect(chatPage.messageInput).toBeVisible();
  });

});

test.describe('Chat: Session @ai-feature', () => {

  test('New Session Initialized', async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.openNewChat();

    await expect(chatPage.messageInput).toBeVisible();
  });

});
