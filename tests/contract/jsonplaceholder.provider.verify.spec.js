const { test } = require('@playwright/test');
const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const env = require('../../config/env');

test('JSONPlaceholderAPI honours the UserWebApp contract @contract', async () => {
  test.setTimeout(60_000);

  await new Verifier({
    provider: 'JSONPlaceholderAPI',
    providerBaseUrl: env.API_BASE_URL,
    pactUrls: [path.resolve(process.cwd(), 'pacts', 'UserWebApp-JSONPlaceholderAPI.json')],
    stateHandlers: {
      'user with id 1 exists': async () => {
        // Public API: user 1 always exists. With your own API you'd seed the DB here.
      },
    },
    logLevel: 'warn',
  }).verifyProvider(); // rejects -> test fails if the real API breaks the contract
});