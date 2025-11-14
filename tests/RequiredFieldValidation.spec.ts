import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { EmployeeOnboardPage } from '../pages/employee-onboard.page';

const DUMMY_EMPLOYEE = {
  firstName: 'TestFirst',
  lastName: 'TestLast',
  email: 'test.email@demo.com',
  fatherName: 'FatherName',
  phone: '1234567890',
  role: '',           // If needed, add as per your form
  status: '',         // If needed
  gender: 'Male',
  maritalStatus: '',  // If needed
  bloodGroup: '',     // If needed
  defaultShift: '',   // If needed
  holidayList: '',    // If needed
  grade: '',          // If needed
  dateOfJoining: '11/01/2023',
  dateOfBirth: '11/01/2000'
};

test.describe('Employee Form Required Field Validation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL || 'http://kolors-dev.rnit.ai');
    await loginPage.login('Administrator', 'Admin@123');
    const onboardPage = new EmployeeOnboardPage(page);
    await onboardPage.navigateToAddEmployee();
  });

  test('should show error if First Name is missing', async ({ page }) => {
    const onboardPage = new EmployeeOnboardPage(page);
    const data = { ...DUMMY_EMPLOYEE, firstName: '' }; // blank first name

    await onboardPage.fillEmployeeDetails(data);
    await onboardPage.submit();

    // Validate error message (update selector and expected message as per your app)
    await expect(page.getByText(/First Name.*required/i)).toBeVisible();
    // Confirm still on form (e.g. Save button still visible)
    await expect(page.getByRole('button', { name: /update/i })).toBeVisible();
  });

  test('should show error if Email is missing', async ({ page }) => {
    const onboardPage = new EmployeeOnboardPage(page);
    const data = { ...DUMMY_EMPLOYEE, email: '' }; // blank email

    await onboardPage.fillEmployeeDetails(data);
    await onboardPage.submit();

    // Validate error message (update selector and expected message as per your app)
    await expect(page.getByText(/Email.*required/i)).toBeVisible();
    // Confirm still on form
    await expect(page.getByRole('button', { name: /update/i })).toBeVisible();
  });
});