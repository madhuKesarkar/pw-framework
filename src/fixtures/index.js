const base = require('@playwright/test');
const { fixtures } = require('./definitions');

const test = base.test.extend(fixtures);

module.exports = { test, expect: base.expect };