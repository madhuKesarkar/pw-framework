const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { PostsService } = require('../api/services/PostsService');
const { UsersService } = require('../api/services/UsersService');
const env = require('../../config/env');
const { AuthService } = require('../api/services/AuthService');
const { BookingService } = require('../api/services/BookingService');

const test = base.test.extend({
  loginPage:     async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage:      async ({ page }, use) => use(new CartPage(page)),

  // loggedInPage:  async ({ page }, use) => {
  //   const login = new LoginPage(page);
  //   await login.goto();
  //   await login.login(env.STANDARD_USER, env.PASSWORD);
  //   await use(new InventoryPage(page));
  // },

  loggedInPage: async ({ page }, use) => {
  await page.goto('/inventory.html');   // session cookie already loaded from storageState
  await use(new InventoryPage(page));
},

  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

// Hybrid pattern: API setup -> test -> API teardown
testPost: async ({ request }, use) => {
  // SETUP via API
  // (JSONPlaceholder doesn't save new data, so we "seed" by reading an existing post.
  //  In a real app this would be a POST that creates fresh data.)
  const res = await request.get(`${env.API_BASE_URL}/posts/1`);
  const post = await res.json();

  await use(post);   // test runs here

  // TEARDOWN via API: runs even if the test fails
  await request.delete(`${env.API_BASE_URL}/posts/${post.id}`);
},

  postsService: async ({ request }, use) => use(new PostsService(request)),
  usersService: async ({ request }, use) => use(new UsersService(request)),
  authService: async ({ request }, use) => use(new AuthService(request)),
  bookingService: async ({ request }, use) => use(new BookingService(request)),

// Valid token, ready for any test that needs one
authToken: async ({ request }, use) => {
  const res = await new AuthService(request).createToken(env.BOOKER_USER, env.BOOKER_PASSWORD);
  const { token } = await res.json();
  await use(token);
},
});
module.exports = { test, expect: base.expect };