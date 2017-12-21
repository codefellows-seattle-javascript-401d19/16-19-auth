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

  describe('POST /signup', () => {
    test('POST creating an account should respond with a 200 and a token if there are no errors', () => {
      return superagent.post(`${apiURL}/signup`)
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
      return superagent.post(`${apiURL}/signup`)
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
      let testUser = {
        username : 'zaphod',
        email : 'president@galaxy.org',
        password : '42',
      };
      return superagent.post(`${apiURL}/signup`)
        .send(testUser)
        .then( () => {
          return superagent.post(`${apiURL}/signup`)
            .send(testUser);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });

  describe('GET /login', () => {
    test.only('GET /login should get a 200 status code and a token if there are no errors', () => {
      return accountMockFactory.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    // TODO : write test for 400 on /login
    // test('GET /login should get a 400 status code if the request is incomplete', () => {
    //   return accountMockFactory.create()
    //     .then(mock => {
    //       return superagent.get(`${apiURL}/login`)
    //         .auth(mock.request.username, mock.request.password);
    //     })
    //     .then(response => {
    //       expect(response.status).toEqual(400);
    //       expect(response.body.token).toBeTruthy();
    //     });
    // });

    // TODO : write test for 404 on /login
    // test('GET /login should get a 404 if the login info is not found', () => {
    //   return accountMockFactory.create()
    //     .then(mock => {
    //       return superagent.get(`${apiURL}/login`)
    //         .auth(mock.request.username, mock.request.password);
    //     })
    //     .then(response => {
    //       expect(response.status).toEqual(404);
    //       expect(response.body.token).toBeTruthy();
    //     });
    // });

    // describe('GET /profile/:id', () => {

    // TODO : write test for 404 on GET/profile/:id

    // TODO : write test for 401 on GET/profile/:id



    // });

  });

});