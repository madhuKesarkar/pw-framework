const { test: setup, expect } = require('@playwright/test');
const env = require('../config/env');

setup('authenticate', async ({ page }) => {
  await page.goto(env.UI_BASE_URL);
  await page.locator('[data-test="username"]').fill(env.STANDARD_USER);
  await page.locator('[data-test="password"]').fill(env.PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: '.auth/user.json' });
});