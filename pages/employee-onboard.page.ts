import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

function ddmmyyyyToISO(date: string | undefined): string | undefined {
  if (!date) return undefined;
  // If already ISO (YYYY-MM-DD), return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  // Convert DD/MM/YYYY to YYYY-MM-DD
  const parts = date.split('/');
  if (parts.length !== 3) return undefined;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return undefined;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

export class EmployeeOnboardPage {
  constructor(private page: Page) {}

  async navigateToAddEmployee() {
    await this.page.getByText('Employee Management', { exact: false }).click();
    await this.page.getByText('Employee On-Board', { exact: false }).click();
    await this.page.waitForTimeout(1000);
    await this.page.getByText('Add New Employee', { exact: false }).click();
    await this.page.getByRole('textbox', { name: /first/i }).first().waitFor({ state: 'visible', timeout: 10000 });
    console.log('Add Employee form is open and ready');
  }

  async fillEmployeeDetails(empData: any) {
    if (empData.firstName) await this.page.getByRole('textbox', { name: /First/i }).first().fill(empData.firstName, { timeout: 30000 });
    if (empData.lastName) await this.page.getByRole('textbox', { name: /Last/i }).first().fill(empData.lastName, { timeout: 30000 });
    if (empData.email) await this.page.getByRole('textbox', { name: /Email/i }).first().fill(empData.email, { timeout: 30000 });
    if (empData.fatherName) {
      try {
        await this.page.getByRole('textbox', { name: /Father/i }).first().fill(empData.fatherName, { timeout: 10000 });
      } catch {}
    }
    if (empData.phone) await this.page.getByRole('textbox', { name: /Phone/i }).first().fill(empData.phone, { timeout: 10000 });
    const selects = await this.page.$$('select');
    for (const s of selects) {
      const name = await s.getAttribute('name');
      const visible = await s.isVisible();
      console.log('Select:', name, 'Visible:', visible);
    }
    if (empData.role) {
      await this.page.waitForSelector('select[name="role_profile"]', { state: 'visible', timeout: 30000 });
      await this.page.waitForFunction(
        () => document.querySelectorAll('select[name="role_profile"] option').length > 1,
        { timeout: 10000 }
      );
      await this.page.selectOption('select[name="role_profile"]', { label: empData.role });
    }
    if (empData.status) await this.page.selectOption('select[name="status"]', { label: empData.status });
    if (empData.gender) await this.page.selectOption('select[name="gender"]', { label: empData.gender });
    if (empData.maritalStatus) await this.page.selectOption('select[name="marital_status"]', { label: empData.maritalStatus });
    if (empData.bloodGroup) await this.page.selectOption('select[name="blood_group"]', { label: empData.bloodGroup });
    if (empData.defaultShift) await this.page.getByLabel('Default Shift').selectOption(empData.defaultShift);
    if (empData.holidayList) await this.page.selectOption('select[name="holiday_list"]', { label: empData.holidayList });
    if (empData.grade) await this.page.selectOption('select[name="grade"]', { label: empData.grade });

    // Only fill date if a valid value is present and formatted
    const joiningISO = ddmmyyyyToISO(empData.dateOfJoining);
    if (joiningISO) {
      await this.page.getByLabel('Date of Joining').fill(joiningISO);
    }
    const dobISO = ddmmyyyyToISO(empData.dateOfBirth);
    if (dobISO) {
      await this.page.getByLabel('Date of Birth').fill(dobISO);
    }
  }

  async fillCompanyDetails(data: any) {
    if (data.leavePolicy) await this.page.selectOption('select[name="leave_policy"]', { label: data.leavePolicy });
    if (data.reportsTo) await this.page.getByLabel('Reports To').selectOption(data.reportsTo);
    if (data.designation) await this.page.getByLabel('Designation').selectOption(data.designation);
    if (data.homeBranch) await this.page.getByLabel('Home Branch *').selectOption(data.homeBranch);
    if (data.department) await this.page.getByLabel('Department').selectOption(data.department);
    if (data.employeeBranches && data.employeeBranches.length) {
      for (const branch of data.employeeBranches) {
        await this.page.click('[role="combobox"]');
        await this.page.fill('input[type="text"]', branch);
        await this.page.keyboard.press('Enter');
      }
    }
    if (data.employmentType) await this.page.getByLabel('Employment Type').selectOption(data.employmentType);
    if (data.orgName) await this.page.getByLabel('Organization Name').selectOption(data.orgName);
  }

  async fillEmergencyContact( data: any) {
    if (data.name) await this.page.getByRole('textbox', { name: /Contact Name/i }).fill(data.name);
    if (data.phone) await this.page.getByRole('textbox', { name: /Contact Phone/i }).fill(data.phone);
    if (data.relationship) await this.page.getByRole('textbox', { name: /Relationship/i }).fill(data.relationship);
  }

  async fillBankDetails(data: any) {
    if (data.bankName) await this.page.getByRole('textbox', { name: /Bank Name/i }).fill(data.bankName);
    if (data.accountNumber) await this.page.fill('input[name="bank_ac_no"]', data.accountNumber);
    if (data.ifsc) await this.page.getByRole('textbox', { name: /IFSC/i }).fill(data.ifsc);
  }

  async fillSalaryDetails(data: any) {
    if (data.ctc) await this.page.getByRole('textbox', { name: /CTC/i }).fill(data.ctc.toString());
  }

  async attachDocuments(files: { idProofPath?: string, addressProofPath?: string, idDocNumber?: string, addressDocNumber?: string }) {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
    const fileInputs = await this.page.$$('input[type="file"]');
    const textInputs = await this.page.$$('input[type="text"]');
    if (files.idProofPath && fileInputs[0]) {
      const idPath = path.isAbsolute(files.idProofPath) ? files.idProofPath : path.resolve(files.idProofPath);
      if (!fs.existsSync(idPath)) throw new Error(`Id proof file not found: ${idPath}`);
      const idStats = fs.statSync(idPath);
      const idExt = path.extname(idPath).toLowerCase();
      if (idStats.size <= 5 * 1024 * 1024 && allowedTypes.includes(idExt)) {
        await fileInputs[0].setInputFiles(idPath);
      } else {
        throw new Error('Id proof file must be <= 5MB, type JPG/JPEG/PNG/PDF');
      }
    }
    if (files.idDocNumber && textInputs[0]) {
      await textInputs[0].fill(files.idDocNumber);
    }
    if (files.addressProofPath && fileInputs[1]) {
      const addressPath = path.isAbsolute(files.addressProofPath) ? files.addressProofPath : path.resolve(files.addressProofPath);
      if (!fs.existsSync(addressPath)) throw new Error(`Address proof file not found: ${addressPath}`);
      const addStats = fs.statSync(addressPath);
      const addExt = path.extname(addressPath).toLowerCase();
      if (addStats.size <= 5 * 1024 * 1024 && allowedTypes.includes(addExt)) {
        await fileInputs[1].setInputFiles(addressPath);
      } else {
        throw new Error('Address proof file must be <= 5MB, type JPG/JPEG/PNG/PDF');
      }
    }
    if (files.addressDocNumber && textInputs[1]) {
      await textInputs[1].fill(files.addressDocNumber);
    }
  }

  async fillPassportDetails( data : any) {
    const passportInputs = await this.page.$$('input[type="text"]');
    if (data.passportNumber && passportInputs[2])
      await passportInputs[2].fill(data.passportNumber);
    if (data.passportIssueDate && passportInputs[3])
      await passportInputs[3].fill(data.passportIssueDate);
    if (data.passportExpiryDate && passportInputs[4])
      await passportInputs[4].fill(data.passportExpiryDate);
  }

  async fillEducationDetails(schools: any[]) {
    const eduInputs = await this.page.$$('input[type="text"]');
    for (const [i, school] of schools.entries()) {
      const baseIndex = i * 4;
      if (school.degree && eduInputs[baseIndex]) await eduInputs[baseIndex].fill(school.degree);
      if (school.institution && eduInputs[baseIndex + 1]) await eduInputs[baseIndex + 1].fill(school.institution);
      if (school.year && eduInputs[baseIndex + 2]) await eduInputs[baseIndex + 2].fill(school.year);
      if (school.score && eduInputs[baseIndex + 3]) await eduInputs[baseIndex + 3].fill(school.score);
      if (i < schools.length - 1) {
        await this.page.locator('button:has-text("Add more")').first().click();
        await this.page.waitForTimeout(300);
      }
    }
  }

  async fillInternalExperience(experiences: any[]) {
    const selectDropdowns = await this.page.$$('select');
    const dateInputs = await this.page.$$('input[type="text"], input[type="date"]');

    // Print select names and order for debugging
    for (let idx = 0; idx < selectDropdowns.length; idx++) {
      let name = await selectDropdowns[idx].getAttribute('name');
      let id = await selectDropdowns[idx].getAttribute('id');
      console.log(`onselect ${idx}: name=${name}, id=${id}`);
    }

    for (const [i, exp] of experiences.entries()) {
      const dropdownBase = i * 3; // Each row: Designation, Branch, Department

      // Print options for debugging
      if (exp.designation && selectDropdowns[dropdownBase]) {
        const opts = await selectDropdowns[dropdownBase].$$('option');
        for (let optIdx = 0; optIdx < opts.length; optIdx++) {
          const label = await opts[optIdx].textContent();
          console.log(`dropdown[${dropdownBase}]Option[${optIdx}]: "${label?.trim()}"`);
        }
        console.log(`Trying to onselect: "${exp.designation}" from Dropdown[${dropdownBase}]`);
        await selectDropdowns[dropdownBase].selectOption({ label: exp.designation });
      }
      if (exp.branch && selectDropdowns[dropdownBase + 1])
        await selectDropdowns[dropdownBase + 1].selectOption({ label: exp.branch });
      if (exp.department && selectDropdowns[dropdownBase + 2])
        await selectDropdowns[dropdownBase + 2].selectOption({ label: exp.department });

      const dateBase = i * 2;
      if (exp.from && dateInputs[dateBase])
        await dateInputs[dateBase].fill(exp.from);
      if (exp.to && dateInputs[dateBase + 1])
        await dateInputs[dateBase + 1].fill(exp.to);

      if (i < experiences.length - 1) {
        await this.page.locator('button:has-text("Add more")').last().click();
        await this.page.waitForTimeout(300);
      }
    }
  }

  async submit() {
    await this.page.getByRole('button', { name: /Save|submit|Update/i }).click();
  }
}