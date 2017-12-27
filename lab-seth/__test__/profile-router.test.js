'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const profileMockFactory = require('./lib/profile-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('Profile Router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMockFactory.remove);

  describe('POST/profiles', () => {
    test('Should return a 200 and a profile if there are no errors', () => {
      let accountMock = null;

      return accountMockFactory.create()
        .then(mock => {
          accountMock = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${accountMock.token}`)//headers
            .send({
              bio: 'I am stupider',
              firstName: 'Cheif',
              lastName: 'Stupid',
            }); //body
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(
            accountMock.account._id.toString());
          expect(response.body.firstName).toEqual('Cheif');
          expect(response.body.lastName).toEqual('Stupid');
          expect(response.body.bio).toEqual('I am stupider');
        });
    });

    //TODO: Write 400, test for POST / profiles

    //TODO: Write 401, test for POST / profiles

  });

  describe('GET/profiles', () => {
    test('Should return a 200 and a profile if there are no errors', () => {
      let profileMock = null;

      return profileMockFactory.create()
        .then(mock => {
          profileMock = mock;
          
          return superagent.get(`${apiURL}/profiles/${profileMock.profile._id}`)
            .set('Authorization', `Bearer ${profileMock.accountMock.token}`);//headers
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(profileMock.profile._id.toString());
          expect(response.body.firstName).toEqual(profileMock.profile.firstName);
          expect(response.body.lastName).toEqual(profileMock.profile.lastName);
          expect(response.body.bio).toEqual(profileMock.profile.bio);
        });
    });



    //TODO: Write 400, test for POST / profiles

    //TODO: Write 401, test for POST / profiles

  });
});