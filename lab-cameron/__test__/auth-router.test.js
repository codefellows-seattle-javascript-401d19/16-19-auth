'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('auth-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  test('POST should create an account and respond with 200 and a token if there are no errors', () => {
    return superagent.post(apiURL)
      .send({
        username: 'testname',
        email: 'test@test.com',
        password: 'secret',
      })
      .then(response => {
        console.log(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('POST /signup - should return 400 if request body is incomplete', () => {
    return superagent.post(apiURL)
      .send({
        username: 'test',
        email: 'test@test.com',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST /signup - should return 409 if unique field is already in use', () => {
    return accountMock.create()
      .then(account => {
        return superagent.post(apiURL)
          .send({
            username: account.request.username,
            email: 'test@test.com',
            password: 'password',
          })
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(409);
          });
      });
  });
});
