import { Page } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.goto('/');   // baseURL from config
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('button:has-text("Login")');
  }

}