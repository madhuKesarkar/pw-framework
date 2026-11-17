const { test, expect } = require('../../src/fixtures');
const { breakLocators } = require('../../src/healing/breakLocators');
const env = require('../../config/env');

test.use({ storageState: { cookies: [], origins: [] } }); // start logged out

// Planted breakages where the correct element is known
const healable = [
  { attr: 'login-button', renamedTo: 'login-btn-v2' },
  { attr: 'username',     renamedTo: 'user-name-input' },
  { attr: 'password',     renamedTo: 'pwd-input' },
];

test.describe('Golden set: heal mode', () => {
  test.use({ healMode: 'heal' });

  for (const b of healable) {
    test(`heals renamed "${b.attr}" and still logs in @healing @regression`, async ({ page, loginPage, healing }) => {
      await breakLocators(page, { [b.attr]: b.renamedTo });
      await loginPage.goto();
      await loginPage.login(env.STANDARD_USER, env.PASSWORD);

      // Landing on Products proves the heal picked the RIGHT element (no false heal)
      await expect(page).toHaveURL(/inventory\.html/);
      expect(healing.filter((e) => e.status === 'healed')).toHaveLength(1);
    });
  }

  test('refuses an ambiguous heal instead of guessing @healing @regression', async ({ page, loginPage, inventoryPage, healing }) => {
    test.setTimeout(30_000);
    await breakLocators(page, { 'add-to-cart-sauce-labs-backpack': 'add-backpack-v2' });
    await loginPage.goto();
    await loginPage.login(env.STANDARD_USER, env.PASSWORD);

    // 6 buttons are called "Add to cart", so no safe heal exists: the action must fail
    await expect(inventoryPage.addToCart('Sauce Labs Backpack')).rejects.toThrow();
    expect(healing[0].status).toBe('not-healed');
    expect(healing[0].attempts[0].result).toBe('matched 6 elements');
  });
});

test.describe('Golden set: report mode', () => {
  test.use({ healMode: 'report' });

  test('fails with a suggested fix instead of healing @healing @regression', async ({ page, loginPage, healing }) => {
    await breakLocators(page, { 'login-button': 'login-btn-v2' });
    await loginPage.goto();

    await expect(loginPage.login(env.STANDARD_USER, env.PASSWORD))
      .rejects.toThrow(/Suggested fix: getByRole\('button', \{ name: 'Login' \}\)/);
    expect(healing[0].status).toBe('suggested');
  });
});