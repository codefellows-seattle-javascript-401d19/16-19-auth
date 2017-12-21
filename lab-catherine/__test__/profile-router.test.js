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
  });

  describe('GET /profiles/:id', () => {
    test('Should return a 200 and a profile if there are no errors', () => {
      let resultMock = null;

      return profileMockFactory.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/profiles/${resultMock.account._id}`)
            .set('Authorization', `Bearer ${resultMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          // expect(response.body.token).toBeTruthy();
          console.log('is this right?', response.body);
        });
    });
  });
});