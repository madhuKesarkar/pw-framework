const { ApiClient } = require('../ApiClient');
class PostsService extends ApiClient {
  constructor(request) { super(request); this.endpoint = '/posts'; }
  getAllPosts()          { return this.get(this.endpoint); }
  getPost(id)            { return this.get(`${this.endpoint}/${id}`); }
  getPostsByUser(userId) { return this.get(this.endpoint, { userId }); }
  getComments(id)        { return this.get(`${this.endpoint}/${id}/comments`); }
  createPost(p)          { return this.post(this.endpoint, p); }
  updatePost(id, p)      { return this.put(`${this.endpoint}/${id}`, p); }
  patchPost(id, p)       { return this.patch(`${this.endpoint}/${id}`, p); }
  deletePost(id)         { return this.delete(`${this.endpoint}/${id}`); }
}
module.exports = { PostsService };