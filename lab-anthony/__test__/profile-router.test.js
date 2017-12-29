'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock');
const profileMockFactory = require('./lib/profile-mock');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMockFactory.remove);

  describe('GET /profiles/:id', () => {

    test('Should return a 200 and a resource', () => {

      let profileMock = null;

      return profileMockFactory.create()
        .then(profile => {
          profileMock = profile;

          const profileId = profileMock.profile._id;
          return superagent.get(`${apiURL}/profiles/${profileId}`)
            .set('Authorization', `Bearer ${profileMock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });

    test('Should return a 404 if a profile is not found', () => {

      let profileMock = null;

      return profileMockFactory.create()
        .then(profile => {
          profileMock = profile;
          return superagent.get(`${apiURL}/profiles/123abcd`)
            .set('Authorization', `Bearer ${profileMock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('Should return a 400 and a resource', () => {
      return superagent.get(`${apiURL}/profiles/123456`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('POST /profiles', () => {
    test('Should return a 200 and a profile if there are no errors', () => {
      let accountMock = null;

      return accountMockFactory.create()
        .then(mock => {
          accountMock = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              bio: 'I am a dog',
              firstName: 'Huck',
              lastName: 'Robinson',
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(accountMock.account._id.toString());
          expect(response.body.firstName).toEqual('Huck');
          expect(response.body.lastName).toEqual('Robinson');
          expect(response.body.bio).toEqual('I am a dog');
        });
    });

    test('Should return a 400 authorization header required', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiURL}/profiles`)
            .send({
              bio: 'I am a dog',
              firstName: 'Huck',
              lastName: 'Robinson',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('Should return a 400 if no token is sent', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', ``)
            .send({
              bio: 'I am a dog',
              firstName: 'Huck',
              lastName: 'Robinson',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('Should return a 401 with a malformed token', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer 12345abcd`)
            .send({
              bio: 'I am a dog',
              firstName: 'Huck',
              lastName: 'Robinson',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});
