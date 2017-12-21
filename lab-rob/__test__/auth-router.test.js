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

    test('login should return a 400 status if no auth header is sent', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.get(`${apiUrl}/login`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('login should throw a 400 status error if authorization is sent without Basic', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.get(`${apiUrl}/login`)
            .set('Authorization', 'schmoopy');
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('login should throw a 400 status error if authorization is sent without an improperly formatted Basic authorization', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.get(`${apiUrl}/login`)
            .set('Authorization', 'Basic hey there bud');
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('login should throw a 404 status error if no username is found with the sent username', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.get(`${apiUrl}/login`)
            .auth('I am not a real username', 'passy');
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});