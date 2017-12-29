'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock');
const pictureMockFactory = require('./lib/picture-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/pictures', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(pictureMockFactory.remove);

  describe('POST /pictures', () => {

    test('POST /pictures should return a 200 status code and a picture if there are no errors', () => {
      let tempAccountMock = null;
      return accountMockFactory.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization',`Bearer ${accountMock.token}`)
            .field('title', 'a picture')
            .attach('picture',`${__dirname}/asset/dog.gif`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('a picture');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });

    test('POST /pictures should return a 400 if no title is entered', () => {
      return accountMockFactory.create()
        .then(accountMock => {
          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization',`Bearer ${accountMock.token}`)
            .field('title', '')
            .attach('picture',`${__dirname}/asset/dog.gif`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('POST /pictures should return a 401 if a bad token is provided', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization',`Bearer 12345abcd`)
            .field('title', '')
            .attach('picture',`${__dirname}/asset/dog.gif`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });

  describe('GET /pictures/:id', () => {

    test('GET /pictures/:id should return a 200 and a response body', () => {
      let pictureMock = null;
      return pictureMockFactory.create()
        .then(mock => {
          pictureMock = mock;
          return superagent.get(`${apiURL}/pictures/${pictureMock.picture._id}`)
            .set('Authorization', `Bearer ${pictureMock.accountMock.token}`);
        })
        .then(response => {
          expect(response.body.url).toEqual(pictureMock.picture.url);
          expect(response.status).toEqual(200);
        });
    });

    test('GET /pictures/:id should return a 404 if a bad id is given', () => {
      return pictureMockFactory.create()
        .then(mock => {
          return superagent.get(`${apiURL}/pictures/12345abcd`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('GET /pictures/:id should return a 401 if a bad token is given', () => {
      return pictureMockFactory.create()
        .then(mock => {
          return superagent.get(`${apiURL}/pictures/${mock.picture._id}`)
            .set('Authorization', `Bearer 12345abcd`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });

  describe('DELETE /pictures/:id', () => {

    test('DELETE /pictures/:id should return a 204 if a picture was successfully deleted', () => {
      return pictureMockFactory.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/pictures/${mock.picture._id}`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('DELETE /pictures/:id should return a 404 if a bad id is entered', () => {
      return pictureMockFactory.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/pictures/12345abcd`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('DELETE /pictures/:id should return a 401 if an invalid token is used', () => {
      return pictureMockFactory.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/pictures/${mock.picture._id}`)
            .set('Authorization', `Bearer 12345abcd`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });

});
