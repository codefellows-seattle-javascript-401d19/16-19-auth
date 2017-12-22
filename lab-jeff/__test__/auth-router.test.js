'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('auth-router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMockFactory.remove);

  describe('POST /signup', () => {
    test('creating an account should respond with a 200 and a token if there are no errors', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          username: 'Dewey',
          email: 'dewey@dog.com',
          password: 'secret',
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test('an incomplete request should return a 400', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          username: 'Dewey',
          email: 'dewey@dog.com',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('duplicate username or email should responsd with 409', () => {
      let userToPost = {
        username: 'Dewey',
        email: 'dewey@dog.com',
        password: 'secret',
      };
      return superagent.post(`${apiURL}/signup`)
        .send(userToPost)
        .then( () => {
          return superagent.post(`${apiURL}/signup`)
            .send(userToPost);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });

    });
  });

  describe('GET - /login', () => {
    test('should get a 200 status code and a token if there are no errors', () => {
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

    test('should get a 400 status if the request headers are not sent properly', () => {
      return accountMockFactory.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should get a 401 status code if the password is incorrect', () => {
      return accountMockFactory.create()
        .then(mock => {
          mock.request.password = 'wrongpassword';
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });

  });


});
