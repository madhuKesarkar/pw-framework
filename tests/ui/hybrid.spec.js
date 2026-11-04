const { test, expect } = require('../../src/fixtures');
const env = require('../../config/env');

test('hybrid: API seeds data, browser shows it, API confirms @regression', async ({ page, request, testPost }) => {
  // ACT via browser: open the resource the fixture prepared
  await page.goto(`${env.API_BASE_URL}/posts/${testPost.id}`);

  // UI check: browser shows the same title the API returned
  await expect(page.locator('body')).toContainText(testPost.title);

  // Backend check: API still returns the expected data
  const api = await (await request.get(`${env.API_BASE_URL}/posts/${testPost.id}`)).json();
  expect(api.title).toBe(testPost.title);
});