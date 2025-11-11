import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new Error('Username or password is missing. Ensure environment variables USERNAME and PASSWORD are set.');
    }
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByRole('textbox', { name: 'Enter username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Enter password' }).fill(password);
    await this.page.getByRole('textbox', { name: 'Enter password' }).press('Enter');
    await this.page.waitForURL(/.*/, { timeout: 60000 });
  }
}