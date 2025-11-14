import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { EmployeeOnboardPage } from '../pages/employee-onboard.page';

const DUMMY_EMPLOYEE = {
  firstName: 'TestFirst',
  lastName: 'TestLast',
  email: 'invalidemail', // Intentionally invalid format
  fatherName: 'FatherName',
  phone: '1234567890',
  gender: 'Male',
  dateOfJoining: '13/11/2025', // DD/MM/YYYY
  dateOfBirth: '01/04/1995',
  // Add other required fields if needed
};

test.describe('Employee Form Invalid Email Format Validation', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(120000); // Set the timeout to 2 minutes for slow CI
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL || 'http://kolors-dev.rnit.ai');
    await loginPage.login('Administrator', 'Admin@123');
    const onboardPage = new EmployeeOnboardPage(page);
    await onboardPage.navigateToAddEmployee();
    // Optional: wait for form to fully load
    await expect(page.getByText(/Employee Management/i)).toBeVisible({ timeout: 15000 });
  });

  test('should show error for invalid email format', async ({ page }) => {
    const onboardPage = new EmployeeOnboardPage(page);

    await onboardPage.fillEmployeeDetails(DUMMY_EMPLOYEE);
    await onboardPage.submit();

    // Adjust error message selector as per actual app's implementation
    await expect(
      page.getByText(/Email.*Invalid Input|valid email/i)
    ).toBeVisible({ timeout: 5000 });

    await expect(
      page.getByRole('button', { name: /Update|Save|Submit/i })
    ).toBeVisible({ timeout: 5000 });
  });
});