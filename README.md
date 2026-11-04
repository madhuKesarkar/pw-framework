# Playwright Test Automation Framework (JavaScript)

![Playwright Tests](https://github.com/madhuKesarkar/pw-framework/actions/workflows/playwright.yml/badge.svg)

A modular, scalable test automation framework built with **Playwright + JavaScript**, covering
**UI**, **API** and **mobile web** testing in one codebase using the **Page Object Model**.

| Layer | Target | Notes |
|---|---|---|
| UI | [SauceDemo](https://www.saucedemo.com) | Chromium + Firefox |
| API | [JSONPlaceholder](https://jsonplaceholder.typicode.com) | CRUD, schema validation, chaining |
| Mobile | SauceDemo on emulated Pixel 7 + iPhone 14 | Viewport, touch, user agent, orientation |

## Key features

- **Page Object Model** – page classes hold locators and actions; tests hold assertions only
- **Service Object pattern for APIs** – `ApiClient` base class with one service per resource
- **Custom fixtures** – page and service objects injected into tests (no repeated setup code)
- **Login once with `storageState`** – a setup project authenticates once; all UI/mobile tests reuse the session
- **Hybrid API + UI testing** – API setup and teardown in fixtures, UI for the journey under test
- **Network mocking** – `page.route` to simulate API responses, errors and blocked resources
- **JSON Schema validation** with AJV to catch API contract changes
- **Data-driven tests** from JSON test data
- **Multi-environment config** via `TEST_ENV` and `.env`
- **Tag-based runs** – `@smoke`, `@regression`
- **Reporting** – HTML, JUnit, screenshots, video and Trace Viewer on failure
- **CI** – GitHub Actions matrix running each project in parallel

## Project structure

```
pw-framework/
├── config/env.js               # environment URLs and credentials
├── src/
│   ├── pages/                  # UI page objects (BasePage, Login, Inventory, Cart, Checkout)
│   ├── api/
│   │   ├── ApiClient.js        # reusable HTTP wrapper
│   │   ├── services/           # PostsService, UsersService
│   │   └── schemas/            # JSON schemas
│   ├── fixtures/index.js       # custom fixtures (DI + hybrid setup/teardown)
│   └── utils/                  # schema validator, test data factory
├── test-data/users.json        # data-driven login cases
├── tests/
│   ├── auth.setup.js           # login once, save storageState
│   ├── ui/                     # login, inventory, checkout, hybrid, network mocking
│   ├── api/                    # posts CRUD, users, API chaining
│   └── mobile/                 # emulated device tests
├── playwright.config.js        # projects: setup, ui-chromium, ui-firefox, api, mobile-android, mobile-ios
└── .github/workflows/          # CI pipeline
```

## Getting started

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/madhuKesarkar/pw-framework.git
cd pw-framework
npm install
npx playwright install
cp .env.example .env    # optional – defaults work for the demo sites
```

## Running tests

```bash
npx playwright test          # everything
npm run test:ui              # desktop UI (Chromium + Firefox)
npm run test:api             # API only
npm run test:mobile          # Pixel 7 + iPhone 14 emulation
npm run test:smoke           # @smoke tagged tests
npm run test:headed          # watch the browser
npx playwright test --ui     # interactive UI mode
npm run report               # open the HTML report
```

Run against another environment:

```bash
TEST_ENV=staging npx playwright test
```

## Design decisions

- **Assertions live in tests, not page objects** – keeps page objects reusable across UI and mobile.
- **Same page objects for desktop and mobile** – only the device project changes.
- **`data-test` locators** – stable, and independent of styling changes.
- **Retries and traces only in CI** – real failures surface locally; flaky ones are diagnosable in CI.
- **Unique test data** via a data factory – safe for parallel execution.

## Notes on the demo sites

SauceDemo and JSONPlaceholder are public practice sites, so the suite runs with no setup or credentials.
JSONPlaceholder does not persist writes (POST/PUT/DELETE return realistic responses only), so the hybrid
fixture reads an existing record instead of creating one. In a real application, the fixture would
create data with a POST and remove it with a DELETE.

## Author

**Madhu Kesarkar** – QA Lead  
[LinkedIn](https://www.linkedin.com/in/madhu-kesarkar-6582572b) · [Portfolio](https://madhukesarkar.netlify.app)
