# 🎯 Playwright + TypeScript Automation Framework

A professional end-to-end automation framework built with **Playwright** and **TypeScript**.

## 🚀 Features
- 100% TypeScript setup
- Page Object Model (POM)
- Test data management
- Utility helpers
- HTML report generation
- GitHub Actions CI/CD integration

## 🧩 Installation

```bash
git clone https://github.com/<your-org>/playwright-typescript-framework.git
cd playwright-typescript-framework
npm install
npx playwright install
```

## 🧪 Running Tests

```bash
npm run test
```

To run headed mode:
```bash
npm run test:headed
```

To open the HTML report:
```bash
npm run report
```

## ⚙️ GitHub Actions CI
This repo includes a workflow file at `.github/workflows/playwright.yml`.

Tests run automatically when:
- Code is pushed to `main` branch
- Pull request is created
- Manual trigger from Actions tab (Run Workflow)
