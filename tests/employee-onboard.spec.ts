import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { AddEmployeePage } from '../pages/employee-onboard.page';

test.describe('Employee Management', () => {
  test('should successfully add a new employee with valid details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const addEmployeePage = new AddEmployeePage(page);

    // Get employee data from environment variables (GitHub Actions inputs)
    const employeeData = {
      firstName: process.env.EMP_FIRST || '',
      lastName: process.env.EMP_LAST || '',
      email: process.env.EMP_EMAIL || '',
      fatherName: process.env.EMP_FATHER || '',
      phone: process.env.EMP_PHONE || ''
    };

    // Log the data being used (for debugging)
    console.log('Testing with employee ', employeeData);

    // Step 1: Authenticate
    await test.step('Login with admin credentials', async () => {
      await loginPage.login('Administrator', 'Admin@123');
    });

    // Step 2: Navigate to Add Employee section
    await test.step('Navigate to Add Employee page', async () => {
      await addEmployeePage.navigateToAddEmployee();
    });

    // Step 3: Fill employee details
    await test.step('Fill employee details', async () => {
      await addEmployeePage.fillEmployeeDetails(employeeData);
    });

    console.log('✅ Employee onboarding test completed successfully!');
  });
});