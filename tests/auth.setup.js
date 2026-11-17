// const { test: setup, expect } = require('@playwright/test');
// const env = require('../config/env');

// setup('authenticate', async ({ page }) => {
//   await page.goto(env.UI_BASE_URL);
//   await page.locator('[data-test="username"]').fill(env.STANDARD_USER);
//   await page.locator('[data-test="password"]').fill(env.PASSWORD);
//   await page.locator('[data-test="login-button"]').click();
//   await expect(page).toHaveURL(/inventory/);
//   await page.context().storageState({ path: '.auth/standard.json' });
// });

const { test: setup, expect } = require('@playwright/test');
const env = require('../config/env');

// One saved session per role. Real app: admin, customer, support...
const roles = {
  standard: { username: env.STANDARD_USER, password: env.PASSWORD },
  visual:   { username: 'visual_user',     password: env.PASSWORD },
};

for (const [role, creds] of Object.entries(roles)) {
  setup(`authenticate as ${role}`, async ({ page }) => {
    await page.goto(env.UI_BASE_URL);
    await page.locator('[data-test="username"]').fill(creds.username);
    await page.locator('[data-test="password"]').fill(creds.password);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
    await page.context().storageState({ path: `.auth/${role}.json` });
  });
}