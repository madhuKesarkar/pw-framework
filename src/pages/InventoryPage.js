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
  async addToCart(name) { await this.byTestId(`add-to-cart-${name.toLowerCase().replace(/\s+/g, '-')}`).click(); }
  async sortBy(option) { await this.sortDropdown.selectOption(option); }
  async getAllPrices() { return (await this.prices.allTextContents()).map(t => parseFloat(t.replace('$', ''))); }
  async openCart() { await this.cartLink.click(); }
  async logout() { await this.menuButton.click(); await this.logoutLink.click(); }
}
module.exports = { InventoryPage };