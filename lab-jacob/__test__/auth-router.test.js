'use strict';

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const apiURL = `http://localhost:${process.env.PORT}/signup`;


describe('Auth Router Tests', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  
  test('should POST creating an account should respond with 200 and a token if there are no errors', () => {
    return superagent.post(apiURL)
      .send({
        username : 'Picard',
        email : 'Enterprise@federation.com',
        password : 'Captain',
      })
      .then(response => {
        console.log(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  
  test('POST signup - an incomplete request return 400', () => {
    return superagent.post(apiURL)
      .send({
        username : 'Picard',
        email : 'Enterprise@federation.com',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });
  
  
  
});
