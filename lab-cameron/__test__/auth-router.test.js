'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('auth-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMockFactory.remove);

  describe('POST /signup', () => {
    test('POST should create an account and respond with 200 and a token if there are no errors', () => {
      return superagent.post(`${apiURL}/signup`)
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
      return superagent.post(`${apiURL}/signup`)
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
      return accountMockFactory.create()
        .then(account => {
          return superagent.post(`${apiURL}/signup`)
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

  describe('GET /login', () => {
    test('GET /login should get a 200 status code and a token if there are no errors', () => {
      return accountMockFactory.create()
        .then(mock => {
          console.log(mock);
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
  });
});
