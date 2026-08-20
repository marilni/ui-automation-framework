import { APIRequestContext } from '@playwright/test';

export class OpenWebUIClient {
  private readonly baseUrl: string;
  private readonly request: APIRequestContext;
  private authToken: string | null = null;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async authenticate(email: string, password: string): Promise<void> {
    const response = await this.request.post(`${this.baseUrl}/api/v1/auths/signin`, {
      data: { email, password },
    });

    if (!response.ok()) {
      throw new Error(`Auth failed: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    this.authToken = body.token;
  }

  async sendMessage(model: string, userMessage: string): Promise<string> {
    if (!this.authToken) {
      throw new Error('Client is not authenticated. Call authenticate() first.');
    }

    const response = await this.request.post(`${this.baseUrl}/api/v1/chat/completions`, {
      headers: { Authorization: `Bearer ${this.authToken}` },
      data: {
        model,
        messages: [{ role: 'user', content: userMessage }],
      },
    });

    if (!response.ok()) {
      throw new Error(`Chat completion failed: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    return body.choices[0].message.content as string;
  }
}
