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
  afterEach(accountMockFactory.remove);
  describe('images POST Route', () => {
    test('Should return a 200 status code and a image if there are no errors', () => {
      return accountMockFactory.create()
        .then(accountMock => {

          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', 'mountains')
            .attach('image', `${__dirname}/assets/mountains.jpg`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('mountains');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });

    test('Should return a 400 status when given a bad request if there are no erros', () => {
      return accountMockFactory.create()
        .then(accountMock => {

          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', '')
            .attach('image', `${__dirname}/assets/mountains.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('Should return a 401 status when given a bad token if there are no erros', () => {
      return accountMockFactory.create()
        .then(accountMock => {

          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.badToken}`)
            .field('title', 'mountains')
            .attach('image', `${__dirname}/assets/mountains.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });

  describe(' images GET Route', () => {
    test('Should return a 200 status code and a image if there are no errors', () => {
      let imageMock = null;

      return imageMockFactory.create()
        .then(mock => {
          imageMock = mock;
          return superagent.get(`${apiURL}/images/${imageMock.image._id}`)
            .set('Authorization', `Bearer ${imageMock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(imageMock.image._id.toString());
          expect(response.body.url).toEqual(imageMock.image.url);
        });
    });

    test('Sould return a 404 if the id is incorrect/not found and there are no other errors', () => {
      let imageMock = null;

      return imageMockFactory.create()
        .then(mock => {
          imageMock = mock;
          return superagent.get(`${apiURL}/images/5a40056e4bc15268d81faa6`)
            .set('Authorization', `Bearer ${imageMock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('Sould return a 401 status when given a bad token if there are no erros', () => {
      let imageMock = null;

      return imageMockFactory.create()
        .then(mock => {
          imageMock = mock;
          return superagent.get(`${apiURL}/images/${imageMock.image._id}`)
            .set('Authorization', `Bearer ${imageMock.accountMock.badToken}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });

  describe(' images DELETE Route', () => {
    test('Should return a 204 status code if there are no errors', () => {
      let imageMock = null;

      return imageMockFactory.create()
        .then(mock => {
          imageMock = mock;
          return superagent.delete(`${apiURL}/images/${imageMock.image._id}`)
            .set('Authorization', `Bearer ${imageMock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
      
    test('Sould return a 404 if the id is incorrect/not found and there are no other errors', () => {
      let imageMock = null;

      return imageMockFactory.create()
        .then(mock => {
          imageMock = mock;
          return superagent.delete(`${apiURL}/images/falseID`)
            .set('Authorization', `Bearer ${imageMock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('Sould return a 401 status when given a bad token if there are no erros', () => {
      let imageMock = null;

      return imageMockFactory.create()
        .then(mock => {
          imageMock = mock;
          return superagent.delete(`${apiURL}/images/${imageMock.image._id}`)
            .set('Authorization', `Bearer ${imageMock.accountMock.badToken}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});