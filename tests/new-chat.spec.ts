import { test } from '../src/fixtures/chatFixtures';

test.describe('Chat: Input @critical-path', () => {

  test('Input Visible On Load', async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.assertInputReady();
  });

});

test.describe('Chat: Session @ai-feature', () => {

  test('New Session Initialized', async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.openNewChat();
    await chatPage.assertMessageInputVisible();
  });

});
