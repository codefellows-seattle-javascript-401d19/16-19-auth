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

  test('POST creating an account should responde with 200 and a token if no errors', () => {
    return superagent.post(apiURL)
      .send({
        username : 'hound',
        email : 'hound@hound.com',
        password : 'supertopsecret',
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('POST sign up - incomplete request should return a 400 status code', () => {
    return superagent.post(apiURL)
      .send({
        username : 'hound',
        email : 'hound@hound.com',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });
  test('POST should return a 409 due to duplicate username property', () => {
    accountMock.create()
      .then(user => {
        return superagent.post(apiURL)
          .send({
            username : user.username,
            email : user.email,
            password : user.password,
          });
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(409);
      });
  });

});