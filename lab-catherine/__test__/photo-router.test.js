'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const photoMockFactory = require('./lib/photo-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/photos', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(photoMockFactory.remove);

  describe('POST /photos', () => {
    test('POST /photos should return a 200 status code and a photo if there are no errors', () => {
      let tempAccountMock = null;

      return accountMockFactory.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${apiURL}/photos`)
            .set('Authorization', `Bearer ${tempAccountMock.token}`)
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
            .set('Authorization', `Bearer ${tempAccountMock.token}`)
            .field('invalidField', 'cat photo')
            .attach('photo', `${__dirname}/asset/mooshy.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('POST /photos should return a 401 status code if invalid token', () => {
      return accountMockFactory.create()
        .then(() => {
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

  describe('GET /photos/:id', () => {
    test('GET should return a 200 status code and a photo if there are no errors', () => {
      let tempPhotoMock = null;
      
      return photoMockFactory.create()
        .then(photoMock => {
          tempPhotoMock = photoMock;
      
          return superagent.get(`${apiURL}/photos/${tempPhotoMock.photo._id}`)
            .set('Authorization', `Bearer ${tempPhotoMock.accountMock.token}`)
            .field('title', 'cat photo')
            .attach('photo', `${__dirname}/asset/mooshy.jpg`)
            .then(response => {
              expect(response.status).toEqual(200);
            });
        });
    });

    test('GET should return a 404 status code if id is not found', () => {
      let tempPhotoMock = null;
      
      return photoMockFactory.create()
        .then(photoMock => {
          tempPhotoMock = photoMock;
      
          return superagent.get(`${apiURL}/photos/invalidId`)
            .set('Authorization', `Bearer ${tempPhotoMock.accountMock.token}`)
            .field('title', 'cat photo')
            .attach('photo', `${__dirname}/asset/mooshy.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(404);
            });
        });
    });

    test('GET should return a 401 status code if token is invalid', () => {
      let tempPhotoMock = null;
      
      return photoMockFactory.create()
        .then(photoMock => {
          tempPhotoMock = photoMock;
      
          return superagent.get(`${apiURL}/photos/${tempPhotoMock.photo._id}`)
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

  describe('DELETE /photos/:id', () => {
    test('DELETE should return a 204 status code if successful', () => {
      let tempPhotoMock = null;
      
      return photoMockFactory.create()
        .then(photoMock => {
          tempPhotoMock = photoMock;
      
          return superagent.delete(`${apiURL}/photos/${tempPhotoMock.photo._id}`)
            .set('Authorization', `Bearer ${tempPhotoMock.accountMock.token}`)
            .then(response => {
              expect(response.status).toEqual(204);
            });
        });
    });

    test('DELETE should return a 404 status code if id is not found', () => {
      let tempPhotoMock = null;
      
      return photoMockFactory.create()
        .then(photoMock => {
          tempPhotoMock = photoMock;
      
          return superagent.delete(`${apiURL}/photos/invalidId`)
            .set('Authorization', `Bearer ${tempPhotoMock.accountMock.token}`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(404);
            });
        });
    });

    test('DELETE should return a 401 status code if token is invalid', () => {
      let tempPhotoMock = null;
      
      return photoMockFactory.create()
        .then(photoMock => {
          tempPhotoMock = photoMock;
      
          return superagent.delete(`${apiURL}/photos/${tempPhotoMock.photo._id}`)
            .set('Authorization', `Bearer is invalid`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });
});