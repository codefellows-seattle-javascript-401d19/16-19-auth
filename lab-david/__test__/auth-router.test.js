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

  test('POST creating an account should respond with a 200 and a token if there are no errors', () => {
    return superagent.post(apiURL)
      .send({
        username : 'zaphod',
        email : 'president@galaxy.org',
        password : '42',
      })
      .then(response => {
        console.log(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('POST /signup - an incomplete request should return a 400', () => {
    return superagent.post(apiURL)
      .send({
        username : 'zaphod',
        email : 'president@galaxy.org',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST /signup - an duplicate username request should send a 409 status', () => {
    return accountMock.create()
      .then(mock => {
        return superagent.post(apiURL)
          .send({
            username : mock.username,
          });
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(409);
      });
  });

});