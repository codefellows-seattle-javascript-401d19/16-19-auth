'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const profileMockFactory = require('./lib/profile-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PROFILE router', () => {
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
              bio: 'I am a fluffy cat',
              firstName: 'Mooshy',
              lastName: 'Looper',
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(accountMock.account._id.toString());
          expect(response.body.firstName).toEqual('Mooshy');
          expect(response.body.lastName).toEqual('Looper');
          expect(response.body.bio).toEqual('I am a fluffy cat');
        });
    });

    test('Should return a 400 if a bad request is sent', () => {
      let accountMock = null;

      return accountMockFactory.create()
        .then(mock => {
          accountMock = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              bio: {},
              firstName: {},
              lastName: {},
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        }); 
    });

    test('Should return a 401 if unauthorized request', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', 'Bearer invalidtoken')
            .send({
              bio: {},
              firstName: {},
              lastName: {},
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        }); 
    });
  });

  describe('GET /profiles/:id', () => {
    test('GET /profiles/:id Should return a 200 and a profile if there are no errors', () => {
      let resultMock = null;

      return profileMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/profiles/${resultMock.profile._id}`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(resultMock.accountMock.account._id.toString());
          expect(response.body.bio).toEqual(resultMock.profile.bio);
          expect(response.body.avatar).toEqual(resultMock.profile.avatar);
          expect(response.body.firstName).toEqual(resultMock.profile.firstName);
          expect(response.body.lastName).toEqual(resultMock.profile.lastName);
        });
    });

    test('GET /profiles/:id Should return a 400 if authentication is invalid', () => {
      let resultMock = null;

      return profileMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/profiles/${resultMock.profile._id}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('GET /profiles/:id Should return a 404 if authentication is invalid', () => {
      let resultMock = null;

      return profileMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/profiles/invalidId`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});