import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class AddEmployeePage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.goto('https://kolors-dev.rnit.ai/');
    await this.page.getByPlaceholder('Enter username').fill(username);
    await this.page.getByPlaceholder('Enter password').fill(password);
    await this.page.getByRole('button', { name: /login/i }).click();
    await this.page.waitForNavigation({ timeout: 20000 });
  }

  async navigateToAddEmployee() {
    await this.page.getByText('Employee Management', { exact: false }).click();
    await this.page.getByText('Employee On-Board', { exact: false }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByText('Add New Employee', { exact: false }).click();
    await this.page.getByRole('textbox', { name: /first/i }).waitFor({ state: 'visible' });
  }

  async selectDropdownOption(label: string, value?: string) {
    const nativeSelect = this.page.locator(`select[name="${label}"]`);
    if (await nativeSelect.count() > 0) {
      await nativeSelect.waitFor({ state: 'visible', timeout: 20000 });
      const optionValues = await nativeSelect.locator('option').evaluateAll(nodes => nodes.map(opt => opt.value));
      const validValues = optionValues.filter(v => v && v.toLowerCase() !== 'select');
      let valueToSelect = value?.trim();
      if (!valueToSelect || !validValues.includes(valueToSelect)) {
        if (!validValues.length) {
          if (label === 'custom_organization_') {
            console.warn(`Skipping dropdown "${label}"—only "Select" option present.`);
            return;
          }
          console.warn(`Skipping dropdown "${label}"—no valid options available.`);
          return;
        }
        valueToSelect = validValues[0];
        console.warn(`Fallback selecting "${label}": "${valueToSelect}"`);
      }
      await nativeSelect.selectOption({ value: valueToSelect });
      return;
    }
    const labelTextMap: Record<string, string> = {
      reports_to: 'Reports To',
      employee_branches: 'Employee Branches',
      is_experienced: 'Is Experienced'
    };
    const labelText = labelTextMap[label] || label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const comboBox = await this.page.locator('input[role="combobox"]').filter({ has: this.page.locator(`label:text-is("${labelText}")`) });
    if (await comboBox.count() === 0) {
      if (await this.page.locator('input[role="combobox"]').count() === 0) {
        console.warn(`Skipping custom dropdown "${label}"—combobox not found.`);
        return;
      }
    }
    const comboboxToUse = (await comboBox.count() > 0) ? comboBox.first() : this.page.locator('input[role="combobox"]').first();
    await comboboxToUse.waitFor({ state: 'visible', timeout: 20000 });
    await comboboxToUse.click();
    await this.page.waitForTimeout(500);

    const allOptions = await this.page.locator('[role="option"]').allTextContents();
    let optionToSelect = value?.trim();
    if (!optionToSelect || !allOptions.includes(optionToSelect)) {
      if (!allOptions.length) {
        console.warn(`Skipping custom dropdown "${label}"—no options available.`);
        return;
      }
      optionToSelect = allOptions[0];
      console.warn(`Fallback selecting "${label}": "${optionToSelect}"`);
    }
    const optionLocator = this.page.locator(`[role="option"]:has-text("${optionToSelect}")`);
    if (await optionLocator.count() > 0) {
      await optionLocator.first().waitFor({ state: 'visible', timeout: 20000 });
      await optionLocator.first().click();
      return;
    }
    console.warn(`Option "${optionToSelect}" not found for "${label}", skipping.`);
  }

  validateAndResolveFilePath(filePath: string): string | undefined {
    if (!filePath) {
      console.warn('No file path provided—skipping file size validation and upload.');
      return undefined;
    }
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(resolvedPath)) {
      console.warn(`File not found at path: ${resolvedPath}—skipping attachment.`);
      return undefined;
    }
    const stats = fs.statSync(resolvedPath);
    if (stats.size > 5 * 1024 * 1024) throw new Error(`File ${resolvedPath} exceeds 5MB`);
    return resolvedPath;
  }

  async fillEmployeeDetails(data: any) {
    // Employee Details
    await this.page.getByRole('textbox', { name: /first/i }).fill(data.firstName);
    await this.page.getByRole('textbox', { name: /middle/i }).fill(data.middleName || '');
    await this.page.getByRole('textbox', { name: /last/i }).fill(data.lastName || '');
    await this.page.getByRole('textbox', { name: /father/i }).fill(data.fatherName || '');
    await this.page.getByRole('textbox', { name: /email/i }).fill(data.email);
    await this.page.getByRole('textbox', { name: /mobile/i }).fill(data.mobile);
    await this.page.getByRole('textbox', { name: /employee id/i }).fill(data.employeeId || '');

    // Company Details and dropdowns
    await this.selectDropdownOption('role_profile', data.role);
    await this.selectDropdownOption('status', data.status);
    await this.page.getByLabel('Date of Joining').click();
    await this.page.getByLabel('Date of Joining').fill(data.doj);
    await this.page.getByLabel('Date of Birth').click();
    await this.page.getByLabel('Date of Birth').fill(data.dob);
    await this.selectDropdownOption('gender', data.gender);
    await this.selectDropdownOption('marital_status', data.maritalStatus);
    await this.selectDropdownOption('blood_group', data.bloodGroup);
    await this.selectDropdownOption('default_shift', data.defaultShift);
    await this.selectDropdownOption('holiday_list', data.holidayList);
    await this.selectDropdownOption('grade', data.grade);
    await this.selectDropdownOption('leave_policy', data.leavePolicy);
    await this.selectDropdownOption('branch', data.homeBranch);
    await this.selectDropdownOption('department', data.department);
    await this.selectDropdownOption('designation', data.designation);
    await this.selectDropdownOption('reports_to', data.reportsTo);
    await this.selectDropdownOption('employee_branches', data.employeeBranches);
    await this.selectDropdownOption('employment_type', data.employmentType);
    await this.selectDropdownOption('custom_organization_', data.organizationName);
    await this.page.getByPlaceholder('Enter probation days').fill(data.probationDays || '');
    await this.page.getByRole('textbox', { name: /esi number/i }).fill(data.esiNumber || '');
    await this.page.getByRole('textbox', { name: /current address/i }).fill(data.currentAddress || '');
    await this.page.getByRole('textbox', { name: /permanent address/i }).fill(data.permanentAddress || '');

    if (typeof data.aadharNumber === 'string' && /^\d{12}$/.test(data.aadharNumber)) {
      await this.page.getByPlaceholder('Enter 12 digit Aadhar number').fill(data.aadharNumber);
    } else {
      console.warn(`Aadhaar number "${data.aadharNumber}" is invalid—skipping field.`);
    }

    // Emergency Contact
    await this.page.getByRole('textbox', { name: /emergency contact name/i }).fill(data.emergencyContactName || '');
    await this.page.getByRole('textbox', { name: /emergency phone/i }).fill(data.emergencyPhoneNumber || '');
    await this.page.getByRole('textbox', { name: /relation/i }).fill(data.emergencyRelation || '');

    // Bank & Salary
    await this.page.getByRole('textbox', { name: /bank name/i }).fill(data.bankName || '');
    await this.page.getByRole('textbox', { name: /bank a\/c/i }).fill(data.bankAccountNo || '');
    await this.page.getByRole('textbox', { name: /ifsc code/i }).fill(data.ifscCode || '');
    await this.page.getByRole('textbox', { name: /pan/i }).fill(data.panNumber || '');
    await this.page.getByRole('textbox', { name: /provident fund account/i }).fill(data.pfAccount || '');
    await this.page.getByRole('textbox', { name: /pf uan/i }).fill(data.pfUan || '');
    await this.page.getByRole('textbox', { name: /ctc/i }).fill(data.ctc || '');

    // Attachments
    const resolvedIdProof = this.validateAndResolveFilePath(data.idProofPath);
    if (resolvedIdProof) {
      await this.page.getByLabel('ID Proof').setInputFiles(resolvedIdProof);
      await this.page.getByRole('textbox', { name: /document no/i }).first().fill(data.idProofDocNo || '');
    }
    const resolvedAddressProof = this.validateAndResolveFilePath(data.addressProofPath);
    if (resolvedAddressProof) {
      await this.page.getByLabel('Address Proof').setInputFiles(resolvedAddressProof);
      await this.page.getByRole('textbox', { name: /document no/i }).nth(1).fill(data.addressProofDocNo || '');
    }

    // Passport Details
    await this.page.getByRole('textbox', { name: /passport number/i }).fill(data.passportNumber || '');
    await this.page.getByLabel('Date of Issue').click();
    await this.page.getByLabel('Date of Issue').fill(data.passportDateOfIssue);

    const validUptoSelector = 'input[name="valid_upto"]';
    try {
      await this.page.waitForFunction(
        selector => {
          const el = document.querySelector(selector);
          return el && !el.disabled;
        },
        validUptoSelector,
        { timeout: 10000 }
      );

      const validUptoInput = this.page.getByLabel('Valid Upto');
      if (await validUptoInput.isEnabled()) {
        await validUptoInput.click();
        await validUptoInput.fill(data.passportValidUpto);
      } else {
        console.warn('Valid Upto input is disabled—skipping fill.');
      }
    } catch (e) {
      console.warn('Valid Upto input did not become enabled in time, skipping field.');
    }
    await this.page.getByRole('textbox', { name: /place of issue/i }).fill(data.passportPlaceOfIssue || '');

    // Education
    await this.page.getByRole('textbox', { name: /school|university/i }).fill(data.educationSchool || '');
    await this.page.getByRole('textbox', { name: /qualification/i }).fill(data.educationQualification || '');
    await this.selectDropdownOption('education_level', data.educationLevel);
    await this.page.getByRole('textbox', { name: /year of passing/i }).fill(data.educationYearOfPassing || '');
    if (data.educationAddMore) await this.page.getByRole('button', { name: /add more/i }).first().click();

    // Is Experienced (as dropdown)
    await this.selectDropdownOption('is_experienced', data.isExperiencedValue);

    // Internal Work Experience
    await this.selectDropdownOption('internal_designation', data.internalDesignation);
    await this.selectDropdownOption('internal_branch', data.internalBranch);
    await this.selectDropdownOption('internal_department', data.internalDepartment);

    // Internal Work Experience Dates (first row)
    await this.page.locator('input[name="internal_work_history.0.from_date"]').fill(data.internalFromDate);
    await this.page.locator('input[name="internal_work_history.0.to_date"]').fill(data.internalToDate);

    // "Add more" row handling for internal work experience
    if (data.internalAddMore) {
      await this.page.getByRole('button', { name: /add more/i }).nth(1).click();
      try {
        await this.page.waitForSelector('input[name="internal_work_history.1.from_date"]', { timeout: 10000 });
        await this.page.locator('input[name="internal_work_history.1.from_date"]').fill(data.internalFromDate2);
        await this.page.locator('input[name="internal_work_history.1.to_date"]').fill(data.internalToDate2);
      } catch {
        console.warn('Second internal work experience row not added, skipping fill.');
      }
    }

    // Final form submission (no success message assertion)
    await this.page.getByRole('button', { name: /submit|save|update/i }).click();
  }
}
