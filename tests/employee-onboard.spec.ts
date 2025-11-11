import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { EmployeeOnboardPage } from '../pages/employee-onboard.page';

test.describe('Employee Onboarding End-to-End', () => {
  test('should fill and submit entire form', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Login with admin credentials', async () => {
      await loginPage.login('Administrator', 'Admin@123');
    });

    const onboardPage = new EmployeeOnboardPage(page);
    await onboardPage.navigateToAddEmployee();

    await onboardPage.fillEmployeeDetails({
      firstName: process.env.EMP_FIRST,
      lastName: process.env.EMP_LAST,
      email: process.env.EMP_EMAIL,
      fatherName: process.env.EMP_FATHER,
      phone: process.env.EMP_PHONE,
      role: '',
      status: '',
      gender: process.env.GENDER,
      maritalStatus: '',
      bloodGroup: '',
      defaultShift: '',
      holidayList: '',
      grade: '',
      dateOfJoining: process.env.DOJ_DAY,
      dateOfBirth: process.env.DOB_DAY
    });

    await onboardPage.fillCompanyDetails({
      leavePolicy: '',
      reportsTo: '',
      designation: '',
      homeBranch: '',
      department: '',
      employeeBranches: '',
      employmentType: '',
      orgName: ''
    });

    await onboardPage.fillEmergencyContact({
      name: '',
      phone: '',
      relationship: ''
    });

    await onboardPage.fillBankDetails({
      bankName: '',
      accountNumber: '',
      ifsc: ''
    });

    await onboardPage.fillSalaryDetails({ ctc: 900000 });

    await onboardPage.attachDocuments({
      idProofPath: '',
      addressProofPath: '',
      idDocNumber: '',
      addressDocNumber: ''
    });

    await onboardPage.fillPassportDetails({
      passportNumber: '',
      passportIssueDate: '',
      passportExpiryDate: ''
    });

    await onboardPage.fillEducationDetails([
      { degree: 'B.Tech', institution: 'IIT', year: '2021', score: '8.5' },
      { degree: 'M.Tech', institution: 'IIT', year: '2023', score: '9.0' }
    ]);

    await onboardPage.fillInternalExperience([
      {
        designation: '',
        branch: '',
        department: '',
        from: '',
        to: ''
      }
    ]);

    await onboardPage.submit();
  });
});