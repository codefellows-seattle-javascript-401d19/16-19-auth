'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const imageMockFactory = require('./lib/image-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('image-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(imageMockFactory.remove);

  describe('POST /images', () => {
    test('POST /images should return a 200 status code and a sound if there are no errors', () => {
      return accountMockFactory.create()
        .then(accountMock => {
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', 'test dog')
            .attach('image', `${__dirname}/asset/dog.jpeg`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('test dog');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });

    test('POST /images should return a 400 if title, file quantity or fieldname is bad', () => {
      return accountMockFactory.create()
        .then(accountMock => {
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .attach('image', `${__dirname}/asset/dog.jpeg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('POST /images should return a 400 if title, file quantity or fieldname is bad', () => {
      return superagent.post(`${apiURL}/images`)
        .set('Authorization', `Bearer invalidToken`)
        .attach('image', `${__dirname}/asset/dog.jpeg`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });

  describe('GET /images/id', () => {
    test.only('GET /images/id should return a 200 if there are no errors', () => {
      return imageMockFactory.create()
        .then(imageMock => {
          console.log(imageMock);
        });
    });
  });
});
