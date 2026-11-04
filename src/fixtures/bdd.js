const { test: bddBase, createBdd } = require('playwright-bdd');
const { fixtures } = require('./definitions');

const test = bddBase.extend(fixtures);
const { Given, When, Then } = createBdd(test);

module.exports = { test, Given, When, Then };