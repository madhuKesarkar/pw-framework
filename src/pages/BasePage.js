const { findElement } = require('../healing/healer');

class BasePage {
  constructor(page) { this.page = page; }
  async open(path = '/') { await this.page.goto(path); }
  byTestId(id) { return this.page.locator(`[data-test="${id}"]`); }

   /** Healing-aware lookup: primary data-test, then backups, then AI (if enabled) */
  async find(element) {
    return findElement(this.page, element);
  }
}
module.exports = { BasePage };