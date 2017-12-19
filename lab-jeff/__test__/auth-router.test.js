'use strict';

require('.lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('authRouter', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  test('POST creating an account should respond with a 200 and a token if there are no errors', () => {
    return superagent.post(apiURL)
      .send({
        username: 'Dewey',
        email: 'dewey@dog.com',
        password: 'secret',
      })
      .then(response => {
        console.log(response.body); //TODO: remove this
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('POST an incomplete request should return a 400', () => {
    return superagent.post(apiURL)
      .send({
        username: 'Dewey',
        email: 'dewey@dog.com',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });
});
