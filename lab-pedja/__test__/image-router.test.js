'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const imageMock = require('./lib/image-mock');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/images', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(imageMock.remove);
  
  // POST TEST
  // ================================
  describe('POST /images', () => {
    test('POST /images should return 200 status code and an image if there is no errors', () => {
      let accountToMock = null;
      return accountMock.create()
        .then(mock => {
          accountToMock = mock;
          
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountToMock.token}`)
            .field('title', 'hero image')
            .attach('image', `${__dirname}/asset/hero.jpg`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('hero image');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });
    test('POST should return 400 if invalid request', () => {
      let accountToMock = null;

      return accountMock.create()
        .then(mock => {
          accountToMock = mock;
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountToMock.token}`)
            .field('INVALIDTITLE', 'hero image')
            .attach('image', `${__dirname}/asset/hero.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });
    test('POST should return 401 if invalid token was sent', () => {
      let accountToMock = null;

      return accountMock.create()
        .then(mock => {
          accountToMock = mock;
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer BADTOKEN`)
            .field('title', 'hero image')
            .attach('image', `${__dirname}/asset/hero.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });

  // GET TEST
  // ================================
  describe('GET /images:id', () => {
    test('GET should return 200 and json representation of specific image if there is no error', () => {
      let resultMock = null;

      return imageMock.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/images/${resultMock.image._id}`)
            .set('Authorization', `Bearer ${resultMock.accountToMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(resultMock.image._id.toString());
          expect(response.body.url).toBeTruthy();
        });
    });
    test('GET Should return a 404 if a bad id is sent', () => {
      let resultMock = null;

      return imageMock.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/images/BADID`)
            .set('Authorization', `Bearer ${resultMock.accountToMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
    test('GET should return 401 if a bad token is sent', () => {
      let resultMock = null;

      return imageMock.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/images/${resultMock.image._id}`)
            .set('Authorization', `Bearer INVALID_TOKEN`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });

  // DELETE METHOD
  // -----------------------------------------------------
  describe('DELETE /languages:id', () => {
    test('DELETE should respond with code 204 if there is no error', () => {
      return imageMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/images/${mock.image._id}`)
            .set('Authorization', `Bearer ${mock.accountToMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    test('DELETE should respond with 404 if ID is invalid', () => {
      return imageMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/images/INVALID_ID`)
            .set('Authorization', `Bearer ${mock.accountToMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
    test('DELETE should respond with 404 if ID is invalid', () => {
      return imageMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/images/${mock.image._id}`)
            .set('Authorization', `Bearer INVALID_TOKEN`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });

  

});