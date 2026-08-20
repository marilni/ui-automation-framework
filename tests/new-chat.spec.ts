import { test, expect } from '../src/fixtures/chatFixtures';

const MODEL = process.env.LLM_MODEL as string;

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

test.describe('Chat: Prompt @ai-feature', () => {

  test('API Response Has Content', async ({ apiClient }) => {
    const response = await apiClient.sendMessage(MODEL, 'Reply with one word: hello');
    expect(response).toMatch(/\w+/);
  });

  test('UI Response Rendered After Prompt', async ({ chatPage }) => {
    await chatPage.goto();
    await chatPage.submitPrompt('Reply with one word: hello');
    await chatPage.assertResponseReceived();
  });

});
