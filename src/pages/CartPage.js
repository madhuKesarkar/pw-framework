const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.itemNames = this.byTestId('inventory-item-name');
    this.checkoutButton = this.byTestId('checkout');   // ← added
  }

  async getItemNames() {
    return this.itemNames.allTextContents();
  }
}

module.exports = { CartPage };