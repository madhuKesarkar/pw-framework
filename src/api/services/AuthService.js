class AuthService {
  constructor(request) {
    this.request = request;
  }

  createToken(username, password) {
    return this.request.post('/auth', { data: { username, password } });
  }
}

module.exports = { AuthService };