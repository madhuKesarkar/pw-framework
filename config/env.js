require('dotenv').config();
const environments = {
  qa:      { UI_BASE_URL: 'https://www.saucedemo.com', API_BASE_URL: 'https://jsonplaceholder.typicode.com', BOOKER_BASE_URL: 'https://restful-booker.herokuapp.com'},
  staging: { UI_BASE_URL: 'https://www.saucedemo.com', API_BASE_URL: 'https://jsonplaceholder.typicode.com', BOOKER_BASE_URL: 'https://restful-booker.herokuapp.com'},

};
const current = environments[process.env.TEST_ENV || 'qa'];
module.exports = {
  ...current,
  STANDARD_USER: process.env.STANDARD_USER || 'standard_user',
  PASSWORD: process.env.PASSWORD || 'secret_sauce',
  BOOKER_USER: process.env.BOOKER_USER || 'admin',
  BOOKER_PASSWORD: process.env.BOOKER_PASSWORD || 'password123',
};