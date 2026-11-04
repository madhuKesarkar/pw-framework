const { test, expect } = require('../../src/fixtures');
const users = require('../../test-data/users.json');

test.use({ storageState: { cookies: [], origins: [] } }); // file-level: applies to every test in this file

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => loginPage.goto());

  test('valid user lands on Products @smoke', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked-out user sees error @regression', async ({ loginPage }) => {
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    await expect(loginPage.errorMessage).toHaveText(users.lockedUser.error);
  });

  for (const d of users.invalidUsers) {
    test(`error for ${d.case} @regression`, async ({ loginPage }) => {
      await loginPage.login(d.username, d.password);
      await expect(loginPage.errorMessage).toHaveText(d.error);
    });
  }
});