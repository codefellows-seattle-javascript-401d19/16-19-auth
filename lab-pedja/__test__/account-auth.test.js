'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('AUTH', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  describe('POST', () => {
    test('POST creating an account should responde with 200 and a token if no errors', () => {
      return superagent.post(`${apiURL}/signup`)
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
      return superagent.post(`${apiURL}/signup`)
        .send({
          username : 'hound',
          email : 'hound@hound.com',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
    test('POST should return a 409 due to duplicate user property', () => {
      let userToPost = {
        username : 'hound',
        email : 'hound@hound.com',
        password : 'supertopsecret',
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
  describe('GET /login', () => {
    test('GET /login should get a 200 status code and token if no errors occur', () => {
      return accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username,mock.request.password);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
  }); 
});