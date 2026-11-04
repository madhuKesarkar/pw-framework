const buildPost = (o = {}) => ({ title: `Auto post ${Date.now()}`, body: 'Created by Playwright', userId: 1, ...o });
module.exports = { buildPost };