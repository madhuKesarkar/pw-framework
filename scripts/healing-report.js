// Collects every test's healing.json into one test-results/healing-report.json
const fs = require('fs');
const path = require('path');

const root = path.resolve('test-results');
const events = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'healing.json') events.push(...JSON.parse(fs.readFileSync(full, 'utf8')));
  }
}
walk(root);

const count = (status) => events.filter((e) => e.status === status).length;
const summary = {
  generatedAt: new Date().toISOString(),
  healed: count('healed'),
  suggested: count('suggested'),
  notHealed: count('not-healed'),
  events,
};

fs.mkdirSync(root, { recursive: true });
fs.writeFileSync(path.join(root, 'healing-report.json'), JSON.stringify(summary, null, 2));
console.log(`Healing report: ${summary.healed} healed, ${summary.suggested} suggested, ${summary.notHealed} not healed`);
console.log(`Written to ${path.join('test-results', 'healing-report.json')}`);