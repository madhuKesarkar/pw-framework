const { expect } = require('@playwright/test');
const { When, Then } = require('../src/fixtures/bdd');

When('I add {string} to the cart', async ({ inventoryPage }, product) => {
  await inventoryPage.addToCart(product);
});

When('I go to the cart', async ({ inventoryPage }) => {
  await inventoryPage.openCart();
});

When('I proceed to checkout', async ({ cartPage }) => {
  await cartPage.checkoutButton.click();
});

When('I enter checkout details:', async ({ checkoutPage }, dataTable) => {
  const [details] = dataTable.hashes(); // first row -> { firstName, lastName, postalCode }
  await checkoutPage.fillDetails(details);
});

When('I finish the order', async ({ checkoutPage }) => {
  await checkoutPage.finish();
});

Then('the cart badge should show {string}', async ({ inventoryPage }, count) => {
  await expect(inventoryPage.cartBadge).toHaveText(count);
});

Then('the order total should contain {string}', async ({ checkoutPage }, total) => {
  await expect(checkoutPage.total).toContainText(total);
});

Then('I should see {string}', async ({ checkoutPage }, message) => {
  await expect(checkoutPage.completeHeader).toHaveText(message);
});