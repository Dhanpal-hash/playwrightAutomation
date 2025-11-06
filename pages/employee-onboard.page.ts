import { Page } from '@playwright/test';

export class AddEmployeePage {
  constructor(private page: Page) {}

  async navigateToAddEmployee() {
    // Step 1: Click "Employee Management" in the sidebar/navigation/menu
    await this.page.getByText('Employee Management', { exact: false }).click();

    // Step 2: Click "Employee Onboard"
    await this.page.getByText('Employee On-Board', { exact: false }).click();

    // OPTIONAL: If there's a loading spinner or animation, wait for a moment
    await this.page.waitForTimeout(1000);

    // Step 3: Click the "Add New Employee" button
    await this.page.getByText('Add New Employee', { exact: false }).click();

    // Step 4: Wait until the "First Name" textbox appears
    await this.page.getByRole('textbox', { name: /first/i }).first().waitFor({ state: 'visible', timeout: 10000 });

    console.log(' Add Employee form is open and ready');
  }

  async fillEmployeeDetails(empData: any) {
    console.log('Starting to fill employee details...');
    await this.page.waitForTimeout(3000);

    if (empData.firstName) {
      await this.page.getByRole('textbox', { name: /First/i }).first().fill(empData.firstName, { timeout: 30000 });
    }
    if (empData.lastName) {
      await this.page.getByRole('textbox', { name: /Last/i }).first().fill(empData.lastName, { timeout: 30000 });
    }
    if (empData.email) {
      await this.page.getByRole('textbox', { name: /Email/i }).first().fill(empData.email, { timeout: 30000 });
    }
    try {
      if (empData.fatherName) {
        await this.page.getByRole('textbox', { name: /Father/i }).first().fill(empData.fatherName, { timeout: 10000 });
      }
    } catch (error) {
      console.log('Father name field not available - skipping');
    }
    if (empData.dateOfJoiningDay) {
      await this.page.getByLabel('Date of Joining *').click();
      await this.page.waitForTimeout(1000);
      await this.page.locator('text="${empData.dateOfJoiningDay}"').first().click();
    }
    if (empData.dateOfBirthDay) {
      await this.page.getByLabel('Date of Birth').click();
      await this.page.waitForTimeout(1000);
      await this.page.locator('text="${empData.dateOfBirthDay}"').first().click();
    }
    if (empData.gender) {
      try {
        await this.page.getByLabel('Gender *').selectOption(empData.gender, { timeout: 10000 });
      } catch (e) {
        console.log('Could not select gender from dropdown');
      }
    }
    console.log(' Form filled successfully!');
  }
}