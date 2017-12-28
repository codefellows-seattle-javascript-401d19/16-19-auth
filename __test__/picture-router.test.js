'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const pictureMockFactory = require('./lib/picture-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('picture-router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(pictureMockFactory.remove);

  describe('POST /pictures', () => {
    test('should return 200 and a picture if no errors', () => {
      return accountMockFactory.create()
        .then(accountMock => {

          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', 'Thor Dog')
            .attach('picture', `${__dirname}/asset/dog-thor.jpg`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('Thor Dog');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });

    test('should return 400 if incorrect field information is sent', () => {
      return accountMockFactory.create()
        .then(accountMock => {

          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('not a valid field', 'Thor Dog')
            .attach('picture', `${__dirname}/asset/dog-thor.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('should return 401 if a bad token is sent', () => {
      return accountMockFactory.create()
        .then(accountMock => {

          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization', `Bearer ${accountMock.token}1`)
            .field('title', 'Thor Dog')
            .attach('picture', `${__dirname}/asset/dog-thor.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });
  describe('GET /pictures:id', () => {
    test('should return 200 and a picture if no errors', () => {
      let resultMock = null;

      return pictureMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/pictures/${resultMock.picture._id}`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(resultMock.picture._id.toString());
          expect(response.body.url).toBeTruthy();
        });
    });

    test('should return 404 if the id is invalid', () => {
      let resultMock = null;

      return pictureMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/pictures/1234`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('should return 401 if a bad token is sent', () => {
      let resultMock = null;

      return pictureMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/pictures/${resultMock.picture._id}`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}1`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });

  });

  describe('DELETE /pictures/:id', () => {
    test('should return a 204 status code if there are no errors', () => {
      let resultMock = null;

      return pictureMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.delete(`${apiURL}/pictures/${resultMock.picture._id}`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('should return 404 if the id is invalid', () => {
      let resultMock = null;

      return pictureMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.delete(`${apiURL}/pictures/1234`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('should return 401 if a bad token is sent', () => {
      let resultMock = null;

      return pictureMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.delete(`${apiURL}/pictures/${resultMock.picture._id}`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}1`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});
