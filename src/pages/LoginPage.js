const { BasePage } = require('./BasePage');

// Each element: primary data-test, what it is in plain English, expected role, backups in order
const ELEMENTS = {
  username: {
    name: 'username', intent: 'the Username field on the login page', testId: 'username', role: 'textbox',
    backups: [{ type: 'placeholder', value: 'Username' }],
  },
  password: {
    name: 'password', intent: 'the Password field on the login page', testId: 'password', role: 'textbox',
    backups: [{ type: 'placeholder', value: 'Password' }],
  },
  loginButton: {
    name: 'loginButton', intent: 'the Login button on the login page', testId: 'login-button', role: 'button',
    backups: [{ type: 'role', role: 'button', name: 'Login' }],
  },
};

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    // Plain locators, kept for assertions in tests
    this.username = this.byTestId('username');
    this.password = this.byTestId('password');
    this.loginButton = this.byTestId('login-button');
    this.errorMessage = this.byTestId('error');
  }

  async goto() {
    await this.open('/');
  }

  // Actions use the healing lookup
  async login(user, pass) {
    await (await this.find(ELEMENTS.username)).fill(user);
    await (await this.find(ELEMENTS.password)).fill(pass);
    await (await this.find(ELEMENTS.loginButton)).click();
  }
}

module.exports = { LoginPage, ELEMENTS };