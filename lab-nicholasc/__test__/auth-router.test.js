'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const apiUrl =`http://localhost:{process.env.PORT}/signup`;

describe('auth router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove({}));

  test('post creating account should respond 200 and token if no errors', () => {
    return superagent.post(apiUrl)
      .send({
        username : 'gregor',
        email : 'gregor@gregor.com',
        password : 'password',
      })
      .then(response => {
        console.log(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('POST /signup should return a 400 if incomplete request', () => {
    return superagent.post(apiUrl)
      .send({
        username : 'gregor',
        email : 'gregor@gregor.com',
      })
      .then(Promise.reject)
      .catch(response => {
        console.log(response.body);
        expect(response.status).toEqual(400);
      });
  });
});
