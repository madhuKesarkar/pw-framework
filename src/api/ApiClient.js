class ApiClient {
  constructor(request) { this.request = request; }
  get(url, params) { return this.request.get(url, { params }); }
  post(url, data)  { return this.request.post(url, { data }); }
  put(url, data)   { return this.request.put(url, { data }); }
  patch(url, data) { return this.request.patch(url, { data }); }
  delete(url)      { return this.request.delete(url); }
}
module.exports = { ApiClient };