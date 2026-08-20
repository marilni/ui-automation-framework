import { Page, Locator, expect } from '@playwright/test';

export class ChatPage {
  readonly page: Page;

  private readonly newChatButton: Locator;
  private readonly messageInput: Locator;
  private readonly chatContainer: Locator;
  private readonly welcomeModalDismiss: Locator;
  private readonly responseMessage: Locator;
  private readonly sendButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.newChatButton = page.getByRole('link', { name: 'New Chat' }).first();
    this.messageInput = page.locator('#chat-input');
    this.chatContainer = page.locator('#message-input-container');
    this.welcomeModalDismiss = page.getByRole('dialog').getByRole('button', { name: 'Close' });
    this.responseMessage = page.locator('#response-content-container .markdown-prose').last();
    this.sendButton = page.locator('#send-message-button');
  }

  async goto() {
    await this.page.goto('/');
    await this.messageInput.waitFor({ state: 'visible' });

    await this.welcomeModalDismiss.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    if (await this.welcomeModalDismiss.isVisible()) {
      await this.welcomeModalDismiss.click();
    }
  }

  async openNewChat() {
    await this.newChatButton.click();
    await this.messageInput.waitFor({ state: 'visible' });
  }

  async submitPrompt(prompt: string) {
    await this.messageInput.fill(prompt);
    await this.sendButton.click();
    await this.messageInput.waitFor({ state: 'visible' });
  }

  async assertInputReady() {
    await expect(this.chatContainer).toBeVisible();
    await expect(this.messageInput).toBeVisible();
  }

  async assertMessageInputVisible() {
    await expect(this.messageInput).toBeVisible();
  }

  async assertResponseReceived() {
    await expect(this.responseMessage).toBeVisible({ timeout: 60000 });
    await expect(this.responseMessage).not.toBeEmpty();
  }
}
