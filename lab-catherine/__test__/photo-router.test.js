'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const photoMockFactory = require('./lib/photo-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/sounds', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(photoMockFactory.remove);

  test('POST /photos should return a 200 status code and a photo if there are no errors', () => {
    let tempAccountMock = null;

    return accountMockFactory.create()
      .then(accountMock => {
        tempAccountMock = accountMock;

        return superagent.post(`${apiURL}/photos`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .field('title', 'cat photo')
          .attach('photo', `${__dirname}/asset/mooshy.jpg`)
          .then(response => {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('cat photo');
            expect(response.body._id).toBeTruthy();
            expect(response.body.url).toBeTruthy();
          });
      });
  });

  test('POST /photos should return a 400 status code if invalid request', () => {
    let tempAccountMock = null;

    return accountMockFactory.create()
      .then(accountMock => {
        tempAccountMock = accountMock;

        return superagent.post(`${apiURL}/photos`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .field('invalidField', 'cat photo')
          .attach('photo', `${__dirname}/asset/mooshy.jpg`)
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(400);
          });
      });
  });

  test('POST /photos should return a 401 status code if invalid token', () => {
    let tempAccountMock = null;

    return accountMockFactory.create()
      .then(accountMock => {
        tempAccountMock = accountMock;

        return superagent.post(`${apiURL}/photos`)
          .set('Authorization', `Bearer is invalid`)
          .field('title', 'cat photo')
          .attach('photo', `${__dirname}/asset/mooshy.jpg`)
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(401);
          });
      });
  });
});