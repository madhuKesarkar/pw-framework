class BasePage {
  constructor(page) { this.page = page; }
  async open(path = '/') { await this.page.goto(path); }
  byTestId(id) { return this.page.locator(`[data-test="${id}"]`); }
}
module.exports = { BasePage };