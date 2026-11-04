const { test } = require('@playwright/test');

class ApiClient {
  constructor(request) {
    this.request = request;
  }

  async send(method, url, options = {}) {
    const start = Date.now();
    const response = await this.request[method](url, options);
    const elapsed = Date.now() - start;

    let body;
    try { body = await response.json(); } catch { body = await response.text(); }

    // Attach to the HTML report so every call is visible
    await test.info().attach(`${method.toUpperCase()} ${url}`, {
      body: JSON.stringify(
        { request: options.data || options.params || null, status: response.status(), timeMs: elapsed, response: body },
        null, 2
      ),
      contentType: 'application/json',
    });

    return response;
  }

  get(url, params)  { return this.send('get', url, { params }); }
  post(url, data)   { return this.send('post', url, { data }); }
  put(url, data)    { return this.send('put', url, { data }); }
  patch(url, data)  { return this.send('patch', url, { data }); }
  delete(url)       { return this.send('delete', url); }

  // Auth pattern: one place to set the token for every request
  withToken(token) {
    this.headers = { Authorization: `Bearer ${token}` };
    return this;
  }
}

module.exports = { ApiClient };