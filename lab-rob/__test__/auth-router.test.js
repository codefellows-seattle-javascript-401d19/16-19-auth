'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('auth-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMockFactory.remove);

  describe('POST /signup', () => {
    test('creating an account should respond with a 200 status and a token.', () => {
      return superagent.post(`${apiUrl}/signup`)
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

    test('should respond with a 400 error if incomplete data is sent.', () => {
      return superagent.post(`${apiUrl}/signup`)
        .send({
          username: 'Ollie',
          email: 'dog_stuff@doggoes.net',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should respond with a 409 if a duplicate username is sent.', () => {
      return accountMockFactory.create()
        .then(mock => {
          return superagent.post(`${apiUrl}/signup`)
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

    test('should respond with a 409 if a duplicate email is sent.', () => {
      return accountMockFactory.create()
        .then(mock => {
          return superagent.post(`${apiUrl}/signup`)
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

  describe('GET /login', () => {
    test('login should return a 200 status and a token if successfully logged in.', () => {
      return accountMockFactory.create()
        .then(mock => {
          return superagent.get(`${apiUrl}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
  });

});