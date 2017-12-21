'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const profileMock = require('./lib/profile-mock');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('Profile router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMock.remove);

  describe('POST /profiles', () => {
    test('Should return a 200 and a profile if there are no errors', () => {
      let acctMock = null;

      return accountMock.create()
        .then(mock => {
          acctMock = mock;
          return superagent.post(`${__API_URL__}/profiles`)
            .set('Authorization', `Bearer ${acctMock.token}`)
            .send({
              bio : 'Meowmeow meooow',
              firstName : 'Kitty',
              lastName : 'Bloom',
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(acctMock.account._id.toString());
          expect(response.body.firstName).toEqual('Kitty');
          expect(response.body.lastName).toEqual('Bloom');
          expect(response.body.bio).toEqual('Meowmeow meooow');
        });
    });

    test('Should return a 400 if it is a bad request', () => {
      let acctMock = null;

      return accountMock.create()
        .then(mock => {
          acctMock = mock;
          return superagent.post(`${__API_URL__}/profiles`)
            .set('Authorization', `Bearer ${acctMock.token}`)
            .send({
              bio: {bio: 4},
              firstName: 'Kitty',
              lastName: 'Bloom',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('Should return a 401 if the authorization is invalid', () => {
      return superagent.post(`${__API_URL__}/profiles`)
        .set('Authorization', 'Bearer fakeToken')
        .send({
          bio: { bio: 4 },
          firstName: 'Kitty',
          lastName: 'Bloom',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });

  describe('GET /profiles/:id', () => {
    test('GET /profiles/:id should return a 200 and a profile if there are no errors', () => {
      let resultObj = null;

      return profileMock.create()
        .then(mock => {
          resultObj = mock;
          return superagent.get(`${__API_URL__}/profiles/${resultObj.profile._id}`)
            .set('Authorization', `Bearer ${resultObj.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(resultObj.accountMock.account._id.toString());
          expect(response.body.firstName).toEqual(resultObj.profile.firstName);
          expect(response.body.lastName).toEqual(resultObj.profile.lastName);
          expect(response.body.bio).toEqual(resultObj.profile.bio);
        });
    });

    test('GET /profiles/:id should return a 400 if authentication is not sent', () => {
      let resultObj = null;

      return profileMock.create()
        .then(mock => {
          resultObj = mock;
          return superagent.get(`${__API_URL__}/profiles/${resultObj.profile._id}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('GET /profiles/:id should return a 404 if user does not exist', () => {
      let resultObj = null;

      return profileMock.create()
        .then(mock => {
          resultObj = mock;
          return superagent.get(`${__API_URL__}/profiles/badId`)
            .set('Authorization', `Bearer ${resultObj.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});