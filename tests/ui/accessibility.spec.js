const { test, expect } = require('../../src/fixtures');
const { checkA11y } = require('../../src/utils/a11y');

test.describe('Accessibility - logged out', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('login page has no critical violations @a11y', async ({ page, loginPage }, testInfo) => {
    await loginPage.goto();
    const { blocking } = await checkA11y(page, testInfo);
    expect(blocking, blocking.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });

  test('login form is usable with keyboard only @a11y', async ({ page, loginPage }) => {
    await loginPage.goto();

    await page.keyboard.press('Tab');
    await expect(loginPage.username).toBeFocused();
    await page.keyboard.type('standard_user');

    await page.keyboard.press('Tab');
    await expect(loginPage.password).toBeFocused();
    await page.keyboard.type('secret_sauce');

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/inventory/);
  });

  test('error message is announced to screen readers @a11y', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login('', '');
  await expect(loginPage.errorMessage).toBeVisible();

  // Screen readers only announce dynamic messages placed in a live region
  const liveRegion = page
    .locator('[role="alert"], [aria-live="assertive"], [aria-live="polite"]')
    .filter({ hasText: 'Username is required' });

  await expect(liveRegion, 'Error message is not inside a live region').toHaveCount(1, { timeout: 2000 });
});

});

test.describe('Accessibility - logged in', () => {
  test('inventory page has no critical violations @a11y', async ({ page, loggedInPage }, testInfo) => {
    const { blocking } = await checkA11y(page, testInfo);
    expect(blocking, blocking.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });

  test('cart page has no critical violations @a11y', async ({ page, loggedInPage }, testInfo) => {
    await loggedInPage.openCart();
    const { blocking } = await checkA11y(page, testInfo);
    expect(blocking, blocking.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });
});