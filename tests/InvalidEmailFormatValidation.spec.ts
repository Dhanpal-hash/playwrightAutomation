import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { EmployeeOnboardPage } from '../pages/employee-onboard.page';

const DUMMY_EMPLOYEE = {
  firstName: 'TestFirst',
  lastName: 'TestLast',
  email: 'invalidemail', // <-- Invalid format on purpose!
  fatherName: 'FatherName',
  phone: '1234567890',
  gender: 'Male',
  dateOfJoining: '13/11/2025',  // DD/MM/YYYY format as per new logic
  dateOfBirth: '01/04/1995'
  // ...other optional fields as needed
};

test.describe('Employee Form Invalid Email Format Validation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL || 'http://kolors-dev.rnit.ai');
    await loginPage.login('Administrator', 'Admin@123');
    const onboardPage = new EmployeeOnboardPage(page);
    await onboardPage.navigateToAddEmployee();
  });

  test('should show error for invalid email format', async ({ page }) => {
    const onboardPage = new EmployeeOnboardPage(page);

    // Use all required fields plus an invalid email
    await onboardPage.fillEmployeeDetails(DUMMY_EMPLOYEE);

    // Click Update (or Save or Submit) button
    await onboardPage.submit();

    // Validate error message (update selector as per your app's actual text)
    await expect(page.getByText(/Email.*Invalid Input|valid email/i)).toBeVisible();

    // Optionally, check that the user still remains on the form (Update button present)
    await expect(page.getByRole('button', { name: /Update|Save|Submit/i })).toBeVisible();
  });
});