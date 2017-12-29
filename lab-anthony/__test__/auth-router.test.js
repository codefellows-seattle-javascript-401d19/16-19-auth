'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('Auth Router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMockFactory.remove);

  test('POST /signup creating an account should respond with a 200', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'Huckleberry',
        email: 'imadog@woofer.com',
        password: 'barkbarkbark',
      })
      .then(response => {
        expect(response.status).toEqual(200);
      });
  });

  test('POST /signup creating an account without required parameters should respond with a 400', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'Huckleberry',
        email: 'imadog@woofer.com',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST /signup creating an account with a bad url should send a 404', () => {
    return superagent.post(`${apiURL}/signu`)
      .send({
        username: 'Huckleberry',
        email: 'imadog@woofer.com',
        password: 'arfarf',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(404);
      });
  });

  test('POST /signup creating an account with a duplicate unique parameter should respond with a 409', () => {
    return accountMockFactory.create()
      .then(duplicateUser => {
        return superagent.post(`${apiURL}/signup`)
          .send({
            username: duplicateUser.account.username,
            email: 'stuff@email.com',
            password: 'secret',
          });
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(409);
      });
  });

  test('GET /login should get a 200 status code and a token if there are no errors', () => {
    return accountMockFactory.create()
      .then(mock => {
        return superagent.get(`${apiURL}/login`)
          .auth(mock.request.username, mock.request.password);
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('GET /login should get a 404 if account is not found', () => {
    return accountMockFactory.create()
      .then(() => {
        return superagent.get(`${apiURL}/login`)
          .auth('username', 'password');
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(404);
      });
  });

  test('GET /login should get a 400 status code if a bad password is provided', () => {
    return accountMockFactory.create()
      .then(() => {
        return superagent.get(`${apiURL}/login`)
          .set('Authorization', 'password');
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });

  test('GET /login should get a 400 status code if no header is sent', () => {
    return accountMockFactory.create()
      .then(() => {
        return superagent.get(`${apiURL}/login`);
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });
});
