const { test, expect } = require('../../src/fixtures');

test.describe('Posts API - negative', () => {
  for (const id of [0, -1, 'abc', 99999]) {
    test(`GET /posts/${id} returns 404 @regression`, async ({ postsService }) => {
      const res = await postsService.getPost(id);
      expect(res.status()).toBe(404);
    });
  }

  test('GET unknown endpoint returns 404 @regression', async ({ request }) => {
    const res = await request.get('/does-not-exist');
    expect(res.status()).toBe(404);
  });

  test('filter with no matches returns empty array @regression', async ({ postsService }) => {
    const res = await postsService.getPostsByUser(9999);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});