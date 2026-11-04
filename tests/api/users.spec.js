const { test, expect } = require('../../src/fixtures');

test('chain: user -> their posts @regression', async ({ usersService, postsService }) => {
  const user = await (await usersService.getUser(2)).json();
  const posts = await (await postsService.getPostsByUser(user.id)).json();
  expect(posts.length).toBeGreaterThan(0);
  expect(posts.every(p => p.userId === user.id)).toBeTruthy();
});