'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('AUTH Router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMockFactory.remove);

  describe('POST', () => {
    test('POST: Create account should respond with a 200', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          username : 'testUser',
          email : 'abc@123.com',
          password : 'p@ssw0rd',
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test('POST: Incomplete signup values should return a 400', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          username : 'failUser',
          email : 'fail@fail.com',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('GET /login', () => {
    test('GET /login should return an Auth Token and a 200 status code.', () => {
      return accountMockFactory.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username,mock.request.password);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
  });
});
