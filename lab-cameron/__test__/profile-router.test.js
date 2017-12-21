'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const profileMockFactory = require('./lib/profile-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('profile-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMockFactory.remove);

  describe('POST /profiles', () => {
    test('Should return a 200 and a profile if there are no errors', () => {
      let accountMock = null;

      return accountMockFactory.create()
        .then(mock => {
          accountMock = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              bio: 'test bio',
              firstName: 'testFirst',
              lastName: 'testLast',
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(accountMock.account._id.toString());
          expect(response.body.firstName).toEqual('testFirst');
          expect(response.body.lastName).toEqual('testLast');
          expect(response.body.bio).toEqual('test bio');
        })
        .catch(error => console.log(error));
    });

    test('should return a 400 status code if no auth header is provided', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiURL}/profiles`)
            .send({
              bio: 'test bio',
              firstName: 'testFirst',
              lastName: 'testLast',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should return a 401 status code if token is invalid or cannot be verified', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', 'Bearer invalidToken')
            .send({
              bio: 'test bio',
              firstName: 'testFirst',
              lastName: 'testLast',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});
