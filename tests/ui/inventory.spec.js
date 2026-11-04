const { test, expect } = require('../../src/fixtures');

test.describe('Inventory & Cart', () => {
  test('shows 6 products @smoke', async ({ loggedInPage }) => {
    await expect(loggedInPage.items).toHaveCount(6);
  });

  test('sort price low to high @regression', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('lohi');
    const prices = await loggedInPage.getAllPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('add two items to cart @smoke', async ({ loggedInPage, cartPage }) => {
    await loggedInPage.addToCart('Sauce Labs Backpack');
    await loggedInPage.addToCart('Sauce Labs Bike Light');
    await expect(loggedInPage.cartBadge).toHaveText('2');
    await loggedInPage.openCart();
    expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  });
});