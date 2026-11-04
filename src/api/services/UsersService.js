const { ApiClient } = require('../ApiClient');
class UsersService extends ApiClient {
  constructor(request) { super(request); this.endpoint = '/users'; }
  getAllUsers() { return this.get(this.endpoint); }
  getUser(id)   { return this.get(`${this.endpoint}/${id}`); }
}
module.exports = { UsersService };