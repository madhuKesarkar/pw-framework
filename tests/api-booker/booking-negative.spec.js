const { test, expect } = require('../../src/fixtures');
const { buildBooking } = require('../../src/utils/dataFactory');

test.describe('Auth - negative', () => {
  test('wrong password does not return a token @regression', async ({ authService }) => {
    const res = await authService.createToken('admin', 'wrong-password');
    const body = await res.json();

    // Design flaw worth raising: API returns 200 instead of 401
    expect(res.status()).toBe(200);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  test('empty credentials rejected @regression', async ({ authService }) => {
    const body = await (await authService.createToken('', '')).json();
    expect(body.token).toBeUndefined();
  });
});

test.describe('Authorisation - negative', () => {
  test('DELETE without token returns 403 @smoke', async ({ bookingService }) => {
    const res = await bookingService.deleteBooking(1);
    expect(res.status()).toBe(403);
  });

  test('PUT with invalid token returns 403 @regression', async ({ bookingService }) => {
    const res = await bookingService.updateBooking(1, buildBooking(), 'invalid-token-123');
    expect(res.status()).toBe(403);
  });

  test('PATCH without token returns 403 @regression', async ({ bookingService }) => {
    const res = await bookingService.patchBooking(1, { firstname: 'Hacker' });
    expect(res.status()).toBe(403);
  });
});

test.describe('Resource - negative', () => {
  for (const id of [0, 99999999, 'abc']) {
    test(`GET /booking/${id} returns 404 @regression`, async ({ bookingService }) => {
      const res = await bookingService.getBooking(id);
      expect(res.status()).toBe(404);
    });
  }
});

test.describe('Validation - negative', () => {
  // Known bug in Restful-Booker: a missing required field returns 500 instead of 400.
  // test.fail() documents the bug: the test PASSES while the bug exists,
  // and turns red once it's fixed, reminding you to remove the marker.
  test('missing firstname should return 400 @regression', async ({ bookingService }) => {
    test.fail(true, 'Known bug: API returns 500 for missing required field');
    const { firstname, ...withoutFirstname } = buildBooking();

    const res = await bookingService.createBooking(withoutFirstname);
    expect(res.status()).toBe(400);
  });

  test('unsupported Accept header is rejected @regression', async ({ bookingService }) => {
    const res = await bookingService.createBooking(buildBooking(), { Accept: 'application/xml-invalid' });
    expect(res.ok()).toBeFalsy();
  });
});

test.describe('Positive control: chained flow', () => {
  test('create, delete with token, then GET returns 404 @smoke', async ({ bookingService, authToken }) => {
    // Create
    const created = await (await bookingService.createBooking(buildBooking())).json();
    const id = created.bookingid;
    expect(id).toBeTruthy();

    // Delete WITH a valid token (Restful-Booker returns 201 here, another quirk)
    const del = await bookingService.deleteBooking(id, authToken);
    expect(del.status()).toBe(201);

    // Confirm it's really gone
    const get = await bookingService.getBooking(id);
    expect(get.status()).toBe(404);
  });
});