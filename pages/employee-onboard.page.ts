import { Page } from '@playwright/test';

export class AddEmployeePage {

  constructor(private page: Page) {}

  async navigateToAddEmployee() {
    await this.page.click('text=Employee Onboard');
    await this.page.click('text=Add Employee');
  }

  async fillEmployeeDetails(empData: any) {
    await this.page.fill('input[name="empFirstName"]', empData.firstName);
    await this.page.fill('input[name="empLastName"]', empData.lastName);
    await this.page.fill('input[name="empEmail"]', empData.email);
    await this.page.fill('input[name="empPhone"]', empData.phone);
    await this.page.fill('input[name="empAddress"]', empData.address);
    await this.page.click('button:has-text("Next")');
  }

}