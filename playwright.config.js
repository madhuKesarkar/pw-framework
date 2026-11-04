const { defineConfig, devices } = require('@playwright/test');
const env = require('./config/env');
const { defineBddConfig } = require('playwright-bdd');

const bddTestDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.js', 'src/fixtures/bdd.js'],
});

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]],
  use: { trace: 'on-first-retry', screenshot: 'only-on-failure', video: 'retain-on-failure' },

  projects: [
  // Runs first: logs in once and saves the session
  { name: 'setup', testDir: './tests', testMatch: /auth\.setup\.js/ },

  // ---------- UI ----------
  {
    name: 'ui-chromium',
    testDir: './tests/ui',
    dependencies: ['setup'],
    use: { ...devices['Desktop Chrome'], baseURL: env.UI_BASE_URL, storageState: '.auth/user.json' },
  },
  {
    name: 'ui-firefox',
    testDir: './tests/ui',
    dependencies: ['setup'],
    use: { ...devices['Desktop Firefox'], baseURL: env.UI_BASE_URL, storageState: '.auth/user.json' },
  },

  // ---------- API (no login needed) ----------
  {
    name: 'api',
    testDir: './tests/api',
    use: {
      baseURL: env.API_BASE_URL,
      extraHTTPHeaders: { 'Content-Type': 'application/json; charset=UTF-8' },
    },
  },

  // ---------- Mobile ----------
  {
    name: 'mobile-android',
    testDir: './tests/mobile',
    dependencies: ['setup'],
    use: { ...devices['Pixel 7'], baseURL: env.UI_BASE_URL, storageState: '.auth/user.json' },
  },
  {
    name: 'mobile-ios',
    testDir: './tests/mobile',
    dependencies: ['setup'],
    use: { ...devices['iPhone 14'], baseURL: env.UI_BASE_URL, storageState: '.auth/user.json' },
  },

  {
  name: 'api-booker',
  testDir: './tests/api-booker',
  timeout: 60_000,   // free Heroku host can be slow to wake up
  use: {
    baseURL: env.BOOKER_BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
 },

 {
  name: 'bdd',
  testDir: bddTestDir,
  use: { ...devices['Desktop Chrome'], baseURL: env.UI_BASE_URL },
},

],
});