const { test, expect } = require('../../src/fixtures');


test.describe('Mobile web', () => {
  test('mobile viewport + touch @smoke', async ({ page, isMobile, loggedInPage }) => {
    expect(isMobile).toBeTruthy();
    expect(page.viewportSize().width).toBeLessThan(500);
    await expect(loggedInPage.title).toHaveText('Products');
  });

  test('burger menu logout @regression', async ({ loggedInPage, loginPage }) => {
    await loggedInPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('landscape still renders @regression', async ({ page, loggedInPage }) => {
    const { width, height } = page.viewportSize();
    await page.setViewportSize({ width: height, height: width });
    await expect(loggedInPage.items.first()).toBeVisible();
  });
});