import { Page, Locator } from '@playwright/test';

export class ChatPage {
  readonly page: Page;

  readonly newChatButton: Locator;
  readonly messageInput: Locator;
  readonly chatContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    this.newChatButton = page.getByRole('link', { name: 'New Chat' }).first();
    this.messageInput = page.locator('#chat-input');
    this.chatContainer = page.locator('#message-input-container');
  }

  async goto() {
    await this.page.goto('/');
    await this.messageInput.waitFor({ state: 'visible' });
  }

  async openNewChat() {
    await this.newChatButton.click();
    await this.messageInput.waitFor({ state: 'visible' });
  }

  async isChatInputReady(): Promise<boolean> {
    return this.messageInput.isVisible();
  }
}
