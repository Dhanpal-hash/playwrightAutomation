import { Page } from '@playwright/test';

export class AddEmployeePage {
  constructor(private page: Page) {}

  async navigateToAddEmployee() {
    // Step 1: Wait extra time after login for GitHub Actions
    console.log('Waiting for page to be ready after login...');
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    await this.page.waitForTimeout(5000); // Extra wait for GitHub Actions
    
    // Step 2: Just go directly to the add employee URL (SKIP navigation)
    console.log('Navigating directly to add employee page...');
    await this.page.goto('/web/employees/add', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Step 3: Wait for page to fully load
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    await this.page.waitForTimeout(5000);
    
    console.log('✅ Successfully navigated to add employee page');
  }

  async fillEmployeeDetails(empData: any) {
    console.log('Starting to fill employee details...');
    
    // Wait for form to be ready
    await this.page.waitForTimeout(3000);
    
    // Fill First Name
    console.log('Filling first name:', empData.firstName);
    await this.page.getByRole('textbox', { name: /First/i }).first().fill(empData.firstName, { timeout: 30000 });
    
    // Fill Last Name
    console.log('Filling last name:', empData.lastName);
    await this.page.getByRole('textbox', { name: /Last/i }).first().fill(empData.lastName, { timeout: 30000 });
    
    // Fill Email
    console.log('Filling email:', empData.email);
    await this.page.getByRole('textbox', { name: /Email/i }).first().fill(empData.email, { timeout: 30000 });
    
    // Fill Father's Name (optional)
    try {
      console.log('Attempting to fill father name...');
      await this.page.getByRole('textbox', { name: /Father/i }).first().fill(empData.fatherName || 'Ramesh', { timeout: 10000 });
    } catch (error) {
      console.log('Father name field not available - skipping');
    }
    
    console.log('✅ Form filled successfully!');
  }
}