'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const apiUrl = `http://localhost:${process.env.PORT}/signup`;

describe('auth-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  test('POST creating an account should respond with a 200 status and a token.', () => {
    return superagent.post(apiUrl)
      .send({
        username: 'stella',
        email: 'stella@dog.com',
        password: 'stellaIsAButt',
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('POST should respond with a 400 error if incomplete data is sent.', () => {
    return superagent.post(apiUrl)
      .send({
        username: 'Ollie',
        email: 'dog_stuff@doggoes.net',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST should respond with a 409 if a duplicate username is sent.', () => {
    return accountMock.create()
      .then(mock => {
        return superagent.post(apiUrl)
          .send({
            username: mock.account.username,
            email: 'new@email.com',
            password: 'secretStuff',
          });
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(409);
      });
  });

  test('POST should respond with a 409 if a duplicate email is sent.', () => {
    return accountMock.create()
      .then(mock => {
        return superagent.post(apiUrl)
          .send({
            username: 'myName',
            email: mock.account.email,
            password: 'secretStuff',
          });
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(409);
      });
  });
});