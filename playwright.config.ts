import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  testDir: './tests',
  
  // Run tests in parallel
  fullyParallel: false,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 1,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  use: {
    // Base URL - should be root of application, not specific page
    baseURL: 'https://demo.playwright.dev/todomvc',
    
    // Browser options
    headless: true,
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshots and videos on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Maximum time each action can take
    actionTimeout: 15000,
    
    // Maximum time each navigation can take
    navigationTimeout: 30000,
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // Set timeout for each test
  timeout: 60000,
});