const { test, expect } = require('@playwright/test');
const path = require('path');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { UsersService } = require('../../src/api/services/UsersService');
const { PostsService } = require('../../src/api/services/PostsService');

const { like, integer, string, regex } = MatchersV3;

const provider = new PactV3({
  consumer: 'UserWebApp',
  provider: 'JSONPlaceholderAPI',
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'warn',
});

// Both tests write to the same contract file, so run them one after another
test.describe.configure({ mode: 'serial' });

// Opens a Playwright request context pointed at the Pact mock server
async function contextFor(playwright, mockServer) {
  return playwright.request.newContext({
    baseURL: mockServer.url,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
}

test.describe('UserWebApp -> JSONPlaceholderAPI contract', () => {
  test('GET /users/1 returns a user @contract', async ({ playwright }) => {
    provider
      .given('user with id 1 exists')
      .uponReceiving('a request for user 1')
      .withRequest({
        method: 'GET',
        path: '/users/1',
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': regex('application/json.*', 'application/json; charset=utf-8') },
        body: {
          id: integer(1),
          name: string('Leanne Graham'),
          username: string('Bret'),
          email: regex('.+@.+\\..+', 'Sincere@april.biz'),
          address: like({ city: 'Gwenborough', zipcode: '92998-3874' }),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const request = await contextFor(playwright, mockServer);
      const res = await new UsersService(request).getUser(1);
      const user = await res.json();

      expect(res.status()).toBe(200);
      expect(user.id).toBe(1);
      expect(user.name).toBe('Leanne Graham');
      await request.dispose();
    });
  });

  test('POST /posts creates a post @contract', async ({ playwright }) => {
    const newPost = { title: 'Pact demo', body: 'Contract testing', userId: 1 };

    provider
      .uponReceiving('a request to create a post')
      .withRequest({
        method: 'POST',
        path: '/posts',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: newPost,
      })
      .willRespondWith({
        status: 201,
        body: {
          id: integer(101),
          title: string('Pact demo'),
          body: string('Contract testing'),
          userId: integer(1),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const request = await contextFor(playwright, mockServer);
      const res = await new PostsService(request).createPost(newPost);

      expect(res.status()).toBe(201);
      expect((await res.json()).id).toBeDefined();
      await request.dispose();
    });
  });
});