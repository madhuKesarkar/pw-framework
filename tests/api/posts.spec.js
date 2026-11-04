const { test, expect } = require('../../src/fixtures');
const { validateSchema } = require('../../src/utils/schemaValidator');
// const { postSchema, postListSchema } = require('../../src/api/schemas/post.schema');
const { postSchema, postListSchema } = require('../../src/api/schemas/post.schema');
const { buildPost } = require('../../src/utils/dataFactory');

test.describe('Posts API', () => {
  test('GET /posts - 100 posts + schema @smoke', async ({ postsService }) => {
    const res = await postsService.getAllPosts();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(100);
    const { valid, errors } = validateSchema(postListSchema, body);
    expect(valid, errors).toBeTruthy();
  });

  test('GET /posts/1 @smoke', async ({ postsService }) => {
    const post = await (await postsService.getPost(1)).json();
    expect(post).toMatchObject({ id: 1, userId: 1 });
    expect(validateSchema(postSchema, post).valid).toBeTruthy();
  });

  test('GET /posts?userId=1 filters @regression', async ({ postsService }) => {
    const posts = await (await postsService.getPostsByUser(1)).json();
    posts.forEach(p => expect(p.userId).toBe(1));
  });

  test('POST /posts creates @smoke', async ({ postsService }) => {
    const payload = buildPost();
    const res = await postsService.createPost(payload);
    expect(res.status()).toBe(201);
    expect(await res.json()).toMatchObject(payload);
  });

  test('PUT /posts/1 @regression', async ({ postsService }) => {
    const payload = { id: 1, title: 'Updated', body: 'Updated body', userId: 1 };
    const res = await postsService.updatePost(1, payload);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(payload);
  });

  test('PATCH /posts/1 @regression', async ({ postsService }) => {
    const body = await (await postsService.patchPost(1, { title: 'Patched' })).json();
    expect(body.title).toBe('Patched');
  });

  test('DELETE /posts/1 @regression', async ({ postsService }) => {
    expect((await postsService.deletePost(1)).status()).toBe(200);
  });

  test('GET invalid id returns 404 @regression', async ({ postsService }) => {
    expect((await postsService.getPost(99999)).status()).toBe(404);
  });
});