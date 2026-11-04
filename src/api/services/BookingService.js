class BookingService {
  constructor(request) {
    this.request = request;
    this.endpoint = '/booking';
  }

  // Restful-Booker sends the token as a cookie
  authHeader(token) {
    return token ? { Cookie: `token=${token}` } : {};
  }

  getBooking(id) {
    return this.request.get(`${this.endpoint}/${id}`);
  }

  createBooking(payload, headers = {}) {
    return this.request.post(this.endpoint, { data: payload, headers });
  }

  updateBooking(id, payload, token) {
    return this.request.put(`${this.endpoint}/${id}`, { data: payload, headers: this.authHeader(token) });
  }

  patchBooking(id, payload, token) {
    return this.request.patch(`${this.endpoint}/${id}`, { data: payload, headers: this.authHeader(token) });
  }

  deleteBooking(id, token) {
    return this.request.delete(`${this.endpoint}/${id}`, { headers: this.authHeader(token) });
  }
}

module.exports = { BookingService };