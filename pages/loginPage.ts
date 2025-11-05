import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    // Navigate to login page (base URL should be the root)
    await this.page.goto('/');
    
    // Wait for login form to be visible
    await this.page.waitForLoadState('networkidle');
    
    // Fill in credentials
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    
    // Click login button
    await this.page.click('button[type="submit"]');
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
  }
}