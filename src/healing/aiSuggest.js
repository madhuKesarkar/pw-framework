const Anthropic = require('@anthropic-ai/sdk');

// Hide anything that looks like personal or sensitive data before it leaves the machine
function mask(text) {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>')
    .replace(/\b\d{4,}\b/g, '<number>');
}

/**
 * Last resort: ask an LLM for a locator, based on the page's accessibility snapshot.
 * Returns { type, role?, name?, value?, confidence, reason } or null.
 * The healer still verifies the suggestion in the real browser before using it.
 */
async function suggestLocator(page, element) {
  const snapshot = mask(await page.locator('body').ariaSnapshot());

  const prompt = `You help repair a broken UI test locator.
Element intent: ${element.intent}
Expected ARIA role: ${element.role}
Old locator (no longer matches): [data-test="${element.testId}"]

Accessibility snapshot of the current page:
${snapshot}

Reply with ONLY a JSON object, no other text:
{"type": "role" | "label" | "placeholder" | "text",
 "role": "<ARIA role, only when type is role>",
 "name": "<accessible name, only when type is role>",
 "value": "<text, only for label/placeholder/text>",
 "confidence": <number 0 to 1>,
 "reason": "<one short sentence>"}`;

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
  const message = await client.messages.create({
    model: process.env.HEAL_AI_MODEL || 'claude-sonnet-5-5',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content.find((c) => c.type === 'text')?.text || '';
  const json = text.match(/\{[\s\S]*\}/);
  return json ? JSON.parse(json[0]) : null;
}

module.exports = { suggestLocator, mask };