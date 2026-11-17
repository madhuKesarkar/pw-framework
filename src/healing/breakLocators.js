/**
 * Simulates a UI change for the golden set: renames data-test attributes
 * in the browser as soon as elements appear, before the test touches them.
 * map = { 'login-button': 'login-btn-v2', ... }
 */
async function breakLocators(page, map) {
  await page.addInitScript((renames) => {
    const rename = () => {
      for (const [from, to] of Object.entries(renames)) {
        document.querySelectorAll(`[data-test="${from}"]`).forEach((el) => el.setAttribute('data-test', to));
      }
    };
    new MutationObserver(rename).observe(document, { subtree: true, childList: true, attributes: true });
  }, map);
}

module.exports = { breakLocators };