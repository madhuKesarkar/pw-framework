const { BasePage } = require('./BasePage');
class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = this.byTestId('title');
    this.items = this.byTestId('inventory-item');
    this.prices = this.byTestId('inventory-item-price');
    this.sortDropdown = this.byTestId('product-sort-container');
    this.cartBadge = this.byTestId('shopping-cart-badge');
    this.cartLink = this.byTestId('shopping-cart-link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = this.byTestId('logout-sidebar-link');
  }
  /** e.g. "Sauce Labs Backpack" -> data-test="add-to-cart-sauce-labs-backpack" */
  async addToCart(productName) {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    const button = await this.find({
      name: 'addToCart',
      intent: `the Add to cart button for ${productName}`,
      testId: `add-to-cart-${slug}`,
      role: 'button',
      // Deliberately generic: there are 6 "Add to cart" buttons, so the healer must refuse
      backups: [{ type: 'role', role: 'button', name: 'Add to cart' }],
    });
    await button.click();
  }
  async sortBy(option) { await this.sortDropdown.selectOption(option); }
  async getAllPrices() { return (await this.prices.allTextContents()).map(t => parseFloat(t.replace('$', ''))); }
  async openCart() { await this.cartLink.click(); }
  async logout() { await this.menuButton.click(); await this.logoutLink.click(); }
}
module.exports = { InventoryPage };