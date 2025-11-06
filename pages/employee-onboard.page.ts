import { Page } from '@playwright/test';

export class AddEmployeePage {
  constructor(private page: Page) {}

  async navigateToAddEmployee() {
    console.log('Waiting for page to be ready after login...');
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    await this.page.waitForTimeout(5000);

    console.log('Navigating directly to add employee page...');
    await this.page.goto('/web/employees/add', { waitUntil: 'networkidle', timeout: 60000 });
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    await this.page.waitForTimeout(5000);

    console.log('✅ Successfully navigated to add employee page');
  }

  async fillEmployeeDetails(empData: any) {
    console.log('Starting to fill employee details...');
    await this.page.waitForTimeout(3000);

    // Fill First Name
    if (empData.firstName) {
      console.log('Filling first name:', empData.firstName);
      await this.page.getByRole('textbox', { name: /First/i }).first().fill(empData.firstName, { timeout: 30000 });
    }

    // Fill Last Name
    if (empData.lastName) {
      console.log('Filling last name:', empData.lastName);
      await this.page.getByRole('textbox', { name: /Last/i }).first().fill(empData.lastName, { timeout: 30000 });
    }

    // Fill Email
    if (empData.email) {
      console.log('Filling email:', empData.email);
      await this.page.getByRole('textbox', { name: /Email/i }).first().fill(empData.email, { timeout: 30000 });
    }

    // Fill Father's Name (optional)
    try {
      if (empData.fatherName) {
        console.log('Filling father name:', empData.fatherName);
        await this.page.getByRole('textbox', { name: /Father/i }).first().fill(empData.fatherName, { timeout: 10000 });
      }
    } catch (error) {
      console.log('Father name field not available - skipping');
    }

    // Date of Joining via calendar popup (e.g. pick day "15")
    if (empData.dateOfJoiningDay) {
      console.log('Picking Date of Joining from calendar:', empData.dateOfJoiningDay);
      await this.page.getByLabel('Date of Joining *').click();
      await this.page.waitForTimeout(1000);
      await this.page.locator(text="${empData.dateOfJoiningDay}").first().click();
    }

    // Date of Birth via calendar popup (e.g. pick day "8")
    if (empData.dateOfBirthDay) {
      console.log('Picking Date of Birth from calendar:', empData.dateOfBirthDay);
      await this.page.getByLabel('Date of Birth').click();
      await this.page.waitForTimeout(1000);
      await this.page.locator(text="${empData.dateOfBirthDay}").first().click();
    }

    // Select Gender with dropdown "Gender *"
    if (empData.gender) {
      try {
        console.log('Selecting gender:', empData.gender);
        await this.page.getByLabel('Gender *').selectOption(empData.gender, { timeout: 10000 });
      } catch (e) {
        console.log('Could not select gender from dropdown');
      }
    }

    console.log('✅ Form filled successfully!');
  }
}