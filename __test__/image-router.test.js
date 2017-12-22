'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const imageMockFactory = require('./lib/image-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/images', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(imageMockFactory.remove);
  describe('images POST Route', () => {
    test('Should return a 200 status code and a image if there are no errors', () => {
      let tempAccountMock = null;
      return accountMockFactory.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', 'mountains')
            .attach('image', `${__dirname}/assets/mountains.jpg`)
            .then(response => {
              console.log(response.body);
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('mountains');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });

    //TODO: ADD 400 TEST
    test('Should return a 400 status when given a bad request if there are no erros', () => {
      let tempAccountMock = null;
      return accountMockFactory.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('tite', '')
            .attach('image', `${__dirname}/assets/mountains.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });
    //TODO: ADD 401 TEST


  });

  describe(' images GET Route', () => {
    //TODO: ADD 200 TEST

    //TODO: ADD 404 TEST

    //TODO: ADD 401 TEST

    
  });

  describe(' images DELETE Route', () => {
    //TODO: ADD 204 TEST

    //TODO: ADD 404 TEST

    //TODO: ADD 401 TEST

    
  });
});