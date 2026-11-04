const { test, expect } = require('@playwright/test');

test('UI shows mocked API data @regression', async ({ page }) => {
  await page.route('**/posts/1', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, title: 'Mocked by Playwright', body: 'x', userId: 1 }),
    })
  );
  await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  await expect(page.locator('body')).toContainText('Mocked by Playwright');
});

test('handles 500 from server @regression', async ({ page }) => {
  await page.route('**/posts/1', (route) => route.fulfill({ status: 500, body: 'Server error' }));
  const response = await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.status()).toBe(500);
});

test('blocks images to speed up tests @regression', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg,svg}', (route) => route.abort());
  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});