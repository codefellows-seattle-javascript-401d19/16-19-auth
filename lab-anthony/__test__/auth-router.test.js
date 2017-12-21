'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock');

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('Auth Router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMockFactory.remove);

  test('POST creating an account should respond with a 200', () => {
    return superagent.post(apiURL)
    .send({
      username: 'Huckleberry',
      email: 'imadog@woofer.com',
      password: 'barkbarkbark',
    })
    .then(response => {
      console.log(response.body);
      expect(response.status).toEqual(200);
    });
  });

  test('POST creating an account without required parameters should respond with a 400', () => {
    return superagent.post(apiURL)
    .send({
      username: 'Huckleberry',
      email: 'imadog@woofer.com',
    })
    .then(Promise.reject)
    .catch(response => {
      expect(response.status).toEqual(400);
    });
  });

  test('POST creating an account with a duplicate unique parameter should respond with a 409', () => {
    accountMockFactory.create()
    .then(duplicateUser => {
      return superagent.post(apiURL)
      .send({
        username: duplicateUser.username,
        email: duplicateUser.email,
        password: duplicateUser.password,
      });
    })
    .then(Promise.reject)
    .catch(response => {
      expect(response.status).toEqual(409);
    });
  });
});
