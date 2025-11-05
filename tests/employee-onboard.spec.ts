import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { AddEmployeePage } from '../pages/employee-onboard.page';

/**
 * Test Suite: Employee Management
 *
 * This test verifies the complete flow of adding a new employee
 * using credentials and employee data from environment variables or defaults.
 */
test.describe('Employee Management', () => {
  test('should successfully add a new employee with valid details', async ({ page }) => {
    // Arrange: Prepare test data from environment variables with fallback to defaults
    // For local testing: uses default values
    // For GitHub Actions: uses environment variables passed from workflow
    const employeeData = {
      firstName: process.env.EMP_FIRST || 'TestFirstName',
      lastName: process.env.EMP_LAST || 'TestLastName',
      email: process.env.EMP_EMAIL || 'test${Date.now()}@example.com',
      phone: process.env.EMP_PHONE || '9876543210',
      address: process.env.EMP_ADDR || '123 Test Address, Test City'
    };

    const credentials = {
      username: 'admin',
      password: 'Admin@123'
    };

    console.log('Testing with employee data:', {
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email
    });

    // Initialize page objects
    const loginPage = new LoginPage(page);
    const addEmployeePage = new AddEmployeePage(page);

    // Act: Perform test actions
    // Step 1: Authenticate
    await test.step('Login with admin credentials', async () => {
      await loginPage.login(credentials.username, credentials.password);
    });

    // Step 2: Navigate to Add Employee section
    await test.step('Navigate to Add Employee page', async () => {
      await addEmployeePage.navigateToAddEmployee();
    });

    // Step 3: Fill in employee details
    await test.step('Fill employee details form', async () => {
      await addEmployeePage.fillEmployeeDetails(employeeData);
    });

    // Assert: Verify successful employee creation
    await test.step('Verify employee was added successfully', async () => {
      await expect(page.getByText('Employee Job Details')).toBeVisible({
        timeout: 10000
      });
    });
  });
});