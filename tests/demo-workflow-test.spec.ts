import { test, expect } from '@playwright/test';

/**
 * Demo Test - Verify Playwright Setup Works
 * This test uses a public demo site to verify your Playwright installation
 */
test.describe('Demo Test - TodoMVC', () => {
  test('should add and complete a todo item', async ({ page }) => {
    // Step 1: Navigate to demo site
    await test.step('Navigate to TodoMVC demo', async () => {
      await page.goto('https://demo.playwright.dev/todomvc/');
      await expect(page).toHaveTitle(/TodoMVC/);
    });

    // Step 2: Add a new todo
    await test.step('Add new todo item', async () => {
      await page.fill('.new-todo', 'Test Playwright Setup');
      await page.keyboard.press('Enter');
      
      // Verify it was added
      await expect(page.locator('.todo-list li')).toHaveText('Test Playwright Setup');
    });

    // Step 3: Mark as complete
    await test.step('Complete the todo', async () => {
      await page.click('.todo-list li .toggle');
      
      // Verify it's marked as completed
      await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
    });

    console.log('✅ Playwright setup is working perfectly!');
  });
});