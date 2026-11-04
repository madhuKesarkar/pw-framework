const { BasePage } = require('./BasePage');
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.username = this.byTestId('username');
    this.password = this.byTestId('password');
    this.loginButton = this.byTestId('login-button');
    this.errorMessage = this.byTestId('error');
  }
  async goto() { await this.open('/'); }
  async login(user, pass) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }
}
module.exports = { LoginPage };