const postSchema = {
  type: 'object',
  required: ['userId', 'id', 'title', 'body'],
  properties: {
    userId: { type: 'integer' },
    id: { type: 'integer' },
    title: { type: 'string' },
    body: { type: 'string' },
  },
  additionalProperties: false,
};

const postListSchema = { type: 'array', items: postSchema };

module.exports = { postSchema, postListSchema };