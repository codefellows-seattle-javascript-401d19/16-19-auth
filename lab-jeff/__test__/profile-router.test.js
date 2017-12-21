'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const profileMockFactory = require('./lib/profile-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('profile-router', () => {
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
              bio: 'I am a dog',
              firstName: 'Dewey',
              lastName: 'Kusowski',
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(accountMock.account._id.toString());
          expect(response.body.firstName).toEqual('Dewey');
          expect(response.body.lastName).toEqual('Kusowski');
          expect(response.body.bio).toEqual('I am a dog');
        });
    });

    test('Should return a 400 if an incorrect parameter is sent', () => {
      let accountMock = null;

      return accountMockFactory.create()
        .then(mock => {
          accountMock = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              bio: {bad: 'bad'},
              firstName: 'Dewey',
              lastName: 'Kusowski',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('Should return a 401 if there is no token', () => {

      return accountMockFactory.create()
        .then( () => {
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer badToken`)
            .send({
              bio: 'I am a dog',
              firstName: 'Dewey',
              lastName: 'Kusowski',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });


  });

  describe('GET /profiles/:id', () => {
    test('Should return a 200 and a profile if there are no errors', () => {
      let resultMock = null;

      return profileMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/profiles/${resultMock.profile._id}`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(resultMock.profile._id.toString());
          expect(response.body.firstName).toEqual(resultMock.profile.firstName);
          expect(response.body.lastName).toEqual(resultMock.profile.lastName);
          expect(response.body.bio).toEqual(resultMock.profile.bio);
        });
    });


    test('Should return a 404 if a bad id is sent', () => {
      let resultMock = null;

      return profileMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/profiles/${resultMock.profile._id}1`)
            .set('Authorization', `Bearer ${resultMock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('Should return a 401 if no token is sent', () => {
      let resultMock = null;

      return profileMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/profiles/${resultMock.profile._id}`)
            .set('Authorization', `Bearer badToken`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});
