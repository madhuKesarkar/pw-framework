const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../src/fixtures/bdd');
const env = require('../config/env');

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

Given('I am logged in as a standard user', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login(env.STANDARD_USER, env.PASSWORD);
});

When('I log in with username {string} and password {string}', async ({ loginPage }, username, password) => {
  await loginPage.login(username, password);
});

Then('I should see the products page', async ({ page, inventoryPage }) => {
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.title).toHaveText('Products');
});

Then('I should see the error {string}', async ({ loginPage }, error) => {
  await expect(loginPage.errorMessage).toHaveText(error);
});