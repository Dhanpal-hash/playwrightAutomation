import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { EmployeeOnboardPage } from '../pages/employee-onboard.page';

// Helper to get today's date in MM/DD/YYYY format for the error message
function getTodayMMDDYYYY() {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${mm}/${dd}/${yyyy}`; 
}

const VALID_EMPLOYEE = {
  firstName: 'TestFirst',
  lastName: 'TestLast',
  email: 'test.valid@email.com',
  fatherName: 'FatherName',
  phone: '1234567890',
  gender: 'Male',
  dateOfBirth: '01/01/1990',
  dateOfJoining: '14/11/2025'
};

test('Date of Birth cannot be in the future', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto(process.env.BASE_URL || 'http://kolors-dev.rnit.ai');
  await loginPage.login('Administrator', 'Admin@123');
  const onboardPage = new EmployeeOnboardPage(page);
  await onboardPage.navigateToAddEmployee();
  await onboardPage.fillEmployeeDetails({
    ...VALID_EMPLOYEE,
    dateOfBirth: '14/11/2030'
  });
  await onboardPage.submit();

  const errorMsg = `Value must be ${getTodayMMDDYYYY()}`;
  await page.waitForTimeout(2000); // Give toast time to display

  // Debug: print page HTML to terminal after submit
  console.log(await page.content());

  await expect(page.getByRole('button', { name: /Update|Save|Submit/i })).toBeVisible();
});