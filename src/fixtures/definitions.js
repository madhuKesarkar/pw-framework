const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { PostsService } = require('../api/services/PostsService');
const { UsersService } = require('../api/services/UsersService');
const { AuthService } = require('../api/services/AuthService');
const { BookingService } = require('../api/services/BookingService');
const env = require('../../config/env');

const fixtures = {
  // ----- UI page objects -----
  loginPage:     async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage:      async ({ page }, use) => use(new CartPage(page)),
  checkoutPage:  async ({ page }, use) => use(new CheckoutPage(page)),

  // Session comes from storageState, so just open the page
  loggedInPage: async ({ page }, use) => {
    await page.goto('/inventory.html');
    await use(new InventoryPage(page));
  },

  // ----- API service objects -----
  postsService:   async ({ request }, use) => use(new PostsService(request)),
  usersService:   async ({ request }, use) => use(new UsersService(request)),
  authService:    async ({ request }, use) => use(new AuthService(request)),
  bookingService: async ({ request }, use) => use(new BookingService(request)),

  // Valid Restful-Booker token
  authToken: async ({ request }, use) => {
    const res = await new AuthService(request).createToken(env.BOOKER_USER, env.BOOKER_PASSWORD);
    const { token } = await res.json();
    await use(token);
  },

  // Hybrid: API setup -> test -> API teardown
  testPost: async ({ request }, use) => {
    const res = await request.get(`${env.API_BASE_URL}/posts/1`);
    const post = await res.json();
    await use(post);
    await request.delete(`${env.API_BASE_URL}/posts/${post.id}`);
  },
};

module.exports = { fixtures };