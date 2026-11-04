const AxeBuilder = require('@axe-core/playwright').default;

/**
 * Runs an axe scan and attaches a readable summary to the HTML report.
 * Returns all violations plus the "blocking" ones that should fail the test.
 */
async function checkA11y(page, testInfo, options = {}) {
  const {
    include,                                          // scan only part of the page, e.g. '#login_button_container'
    exclude = [],                                     // skip known third-party widgets
    tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    failOn = ['critical'],                            // impact levels that fail the test
  } = options;

  let builder = new AxeBuilder({ page }).withTags(tags);
  if (include) builder = builder.include(include);
  for (const selector of exclude) builder = builder.exclude(selector);

  const results = await builder.analyze();

  const summary = results.violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    issue: v.help,
    elements: v.nodes.length,
    fixGuide: v.helpUrl,
  }));

  await testInfo.attach('accessibility-report', {
    body: JSON.stringify(summary, null, 2),
    contentType: 'application/json',
  });

  const blocking = results.violations.filter((v) => failOn.includes(v.impact));
  return { violations: results.violations, blocking };
}

module.exports = { checkA11y };