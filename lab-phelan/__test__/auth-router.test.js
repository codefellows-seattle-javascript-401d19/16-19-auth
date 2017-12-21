'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('AUTH Router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  test('POST: Create account should respond with a 200', () => {
    return superagent.post(apiURL)
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
    return superagent.post(apiURL)
      .send({
        username: 'failUser',
        email: 'fail@fail.com',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });

});
