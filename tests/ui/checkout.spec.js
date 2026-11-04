const { test, expect } = require('../../src/fixtures');

test('user completes purchase end to end @smoke', async ({ loggedInPage, cartPage, checkoutPage }) => {
  await loggedInPage.addToCart('Sauce Labs Backpack');
  await loggedInPage.openCart();
  await cartPage.checkoutButton.click();

  await checkoutPage.fillDetails({ firstName: 'Madhu', lastName: 'K', postalCode: '560001' });
  await expect(checkoutPage.total).toContainText('$32.39');

  await checkoutPage.finish();
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});