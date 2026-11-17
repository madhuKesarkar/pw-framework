const { test } = require('@playwright/test');
const ai = require('./aiSuggest');

// Per-test healing context, set by the `healing` auto fixture.
// Each Playwright worker is its own process and runs tests one at a time,
// so a module-level variable is safe here.
let current = { mode: 'off', events: [] };

function setHealingContext(ctx) {
  current = ctx;
}

// Turns a backup strategy into a Playwright locator.
function buildLocator(page, s) {
  switch (s.type) {
    case 'role':        return page.getByRole(s.role, { name: s.name, exact: true });
    case 'label':       return page.getByLabel(s.value, { exact: true });
    case 'placeholder': return page.getByPlaceholder(s.value, { exact: true });
    case 'text':        return page.getByText(s.value, { exact: true });
    default: throw new Error(`Unknown healing strategy: ${s.type}`);
  }
}

// Human-readable form of a strategy, used in reports and suggested fixes.
function describe(s) {
  switch (s.type) {
    case 'role':        return `getByRole('${s.role}', { name: '${s.name}' })`;
    case 'label':       return `getByLabel('${s.value}')`;
    case 'placeholder': return `getByPlaceholder('${s.value}')`;
    case 'text':        return `getByText('${s.value}')`;
    default:            return JSON.stringify(s);
  }
}

// Works out an element's role from its tag (enough for buttons, inputs, links).
async function roleOf(locator) {
  return locator.evaluate((el) => {
    const explicit = el.getAttribute('role');
    if (explicit) return explicit;
    const tag = el.tagName.toLowerCase();
    if (tag === 'button') return 'button';
    if (tag === 'a' && el.hasAttribute('href')) return 'link';
    if (tag === 'select') return 'combobox';
    if (tag === 'textarea') return 'textbox';
    if (tag === 'input') {
      const type = (el.getAttribute('type') || 'text').toLowerCase();
      if (['submit', 'button', 'reset'].includes(type)) return 'button';
      if (type === 'checkbox') return 'checkbox';
      if (type === 'radio') return 'radio';
      return 'textbox';
    }
    return tag;
  });
}

// A backup is accepted only if it finds exactly ONE visible element with the expected role.
async function verifyCandidate(locator, expectedRole) {
  const count = await locator.count();
  if (count !== 1) return { ok: false, reason: `matched ${count} elements` };
  if (!(await locator.isVisible())) return { ok: false, reason: 'element not visible' };
  const role = await roleOf(locator);
  if (expectedRole && role !== expectedRole) return { ok: false, reason: `role is "${role}", expected "${expectedRole}"` };
  return { ok: true };
}

/**
 * Finds an element, healing the locator if the primary data-test attribute is gone.
 * element = { name, intent, testId, role, backups: [ { type, ... } ] }
 */
async function findElement(page, element, { primaryTimeout = 3000 } = {}) {
  const primary = page.locator(`[data-test="${element.testId}"]`);
  if (current.mode === 'off') return primary;

  // 1. Primary locator, short timeout
  try {
    await primary.first().waitFor({ state: 'visible', timeout: primaryTimeout });
    return primary;
  } catch {
    // primary not found: try the backups
  }

  // 2. Backups in order
  const attempts = [];
  for (const strategy of element.backups || []) {
    const candidate = buildLocator(page, strategy);
    const check = await verifyCandidate(candidate, element.role);
    attempts.push({ strategy: describe(strategy), result: check.ok ? 'accepted' : check.reason });
    if (check.ok) return record(primary, candidate, element, strategy, attempts);
  }

  // 3. Last resort: AI suggestion, only when HEAL_AI=on. The browser still has the final say.
  if (process.env.HEAL_AI === 'on') {
    const minConfidence = Number(process.env.HEAL_AI_MIN_CONFIDENCE || 0.8);
    try {
      const s = await ai.suggestLocator(page, element);
      if (!s) {
        attempts.push({ strategy: 'ai', result: 'no usable suggestion' });
      } else if (s.confidence < minConfidence) {
        attempts.push({ strategy: `ai: ${describe(s)}`, result: `confidence ${s.confidence} below ${minConfidence}` });
      } else {
        const candidate = buildLocator(page, s);
        const check = await verifyCandidate(candidate, element.role);
        attempts.push({ strategy: `ai: ${describe(s)}`, result: check.ok ? 'accepted' : check.reason, reason: s.reason });
        if (check.ok) return record(primary, candidate, element, { ...s, type: s.type, source: 'ai' }, attempts);
      }
    } catch (e) {
      attempts.push({ strategy: 'ai', result: `error: ${e.message}` });
    }
  }

  // 4. Nothing safe found: no heal. Returning the primary lets the action fail normally.
  current.events.push({
    status: 'not-healed',
    element: element.name,
    intent: element.intent,
    oldLocator: `[data-test="${element.testId}"]`,
    attempts,
  });
  return primary;
}

function record(primary, candidate, element, strategy, attempts) {
  const event = {
    status: current.mode === 'report' ? 'suggested' : 'healed',
    test: test.info().titlePath.join(' › '),
    element: element.name,
    intent: element.intent,
    oldLocator: `[data-test="${element.testId}"]`,
    newLocator: describe(strategy),
    strategy: strategy.source === 'ai' ? `ai-${strategy.type}` : strategy.type,
    attempts,
  };
  current.events.push(event);

  if (current.mode === 'report') {
    // Report mode: the test still fails, but the error shows the suggested fix
    throw new Error(
      `Locator for "${element.intent}" is broken: ${event.oldLocator} not found.\n` +
      `Suggested fix: ${event.newLocator} (HEAL_MODE=report, so the test is not healed)`
    );
  }

  test.info().annotations.push({
    type: 'healed',
    description: `${element.name}: ${event.oldLocator} -> ${event.newLocator}`,
  });
  return candidate;
}

module.exports = { findElement, setHealingContext, buildLocator, verifyCandidate, describe };   