const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstName = this.byTestId('firstName');
    this.lastName = this.byTestId('lastName');
    this.postalCode = this.byTestId('postalCode');
    this.continueButton = this.byTestId('continue');
    this.finishButton = this.byTestId('finish');
    this.total = this.byTestId('total-label');
    this.completeHeader = this.byTestId('complete-header');
  }

  async fillDetails({ firstName, lastName, postalCode }) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };