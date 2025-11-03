import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe ('Example Page Verification', () => {
  test('Verify Example.com loads', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.verifyPageTitle();
  });
});