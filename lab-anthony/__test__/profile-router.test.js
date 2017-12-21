'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock');
const profileMockFactory = require('./lib/profile-mock');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMockFactory.remove);

  describe('GET /profiles/:id', () => {
    let profileMock = null;

    test('Should return a 200 and a resource', () => {
      return profileMockFactory.create()
      .then(profile => {
        profileMock = profile;
        return superagent.get(`${apiURL}/profiles/${profile.accountMock.id}`)
        .set('Authorization', (`Bearer ${profileMock.accountMock.token}`));
      })
      .then(response => {
        expect(response.status).toEqual(200);
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
  });

});
