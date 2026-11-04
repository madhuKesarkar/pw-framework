const buildPost = (o = {}) => ({ title: `Auto post ${Date.now()}`, body: 'Created by Playwright', userId: 1, ...o });

function buildBooking(overrides = {}) {
  return {
    firstname: 'Madhu',
    lastname: `Test-${Date.now()}`,
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

module.exports = { buildPost, buildBooking };