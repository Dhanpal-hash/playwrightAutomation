import { test } from '@playwright/test';
import { AddEmployeePage } from 'pages/EmployeeOnboardFullTest.page';

test('Complete employee onboard form flow', async ({ page }) => {
  const addEmployeePage = new AddEmployeePage(page);

  // Fill out with sample valid data, replace with real data where needed
  const employeeData = {
    firstName: '',
    middleName: '',
    lastName: '',
    fatherName: '',
    role: '',
    email: '',
    mobile: '',
    employeeId: '',
    status: '',
    doj: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    bloodGroup: '',
    defaultShift: '',
    holidayList: '',
    grade: '',
    currentAddress: '',
    permanentAddress: '',
    aadharNumber: '',
    leavePolicy: '',
    reportsTo: '',
    designation: '',
    homeBranch: '',
    department: '',
    employeeBranches: '',
    employmentType: '',
    probationDays: '',
    esiNumber: '',
    organizationName: '',
    emergencyContactName: '',
    emergencyPhoneNumber: '',
    emergencyRelation: '',
    bankName: '',
    bankAccountNo: '',
    ifscCode: '',
    panNumber: '',
    pfAccount: '',
    pfUan: '',
    ctc: '',
    idProofPath: '',
    idProofDocNo: '',
    addressProofPath: '',
    addressProofDocNo: '',
    passportNumber: '',
    passportDateOfIssue: '',
    passportValidUpto: '',
    passportPlaceOfIssue: '',
    educationSchool: '',
    educationQualification: '',
    educationLevel: '',
    educationYearOfPassing: '',
    educationAddMore: true,
    isExperienced: true,
    internalDesignation: '',
    internalBranch: '',
    internalDepartment: '',
    internalFromDate: '',
    internalToDate: '',
    internalAddMore: true,
  };

  // Step 1: Login
  await test.step('Login with admin credentials', async () => {
    await addEmployeePage.login('Bhagya@test.com', 'Rnit@123');
  });

  // Step 2: Navigate to Add Employee page
  await test.step('Navigate to Add Employee page', async () => {
    await addEmployeePage.navigateToAddEmployee();
  });

  // Step 3: Fill employee details including new fields
  await test.step('Fill employee details', async () => {
    await addEmployeePage.fillEmployeeDetails(employeeData);
  });

  // No success message assertion, just submit and finish.
});
