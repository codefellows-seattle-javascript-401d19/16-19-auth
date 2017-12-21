'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory.js');
const profileMockFactory = require('./lib/profile-mock-factory.js');

const apiURL = `http://localhost:${process.env.PORT}`;


describe('POST /profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMockFactory.remove);

  
  test('should return a 200 and a profile if there are no errors', () => {
    let accountMock = null;

    return accountMockFactory.create()
      .then(mock => {
        accountMock = mock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .send({
            bio : 'I am a Starship Captain',
            firstName : 'Jean Luc',
            lastname : 'Picard',
          });
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.firstName).toEqual('Jean Luc');
        expect(response.body.lastName).toEqual('Picard');
        expect(response.body.bio).toEqual('I am a Starship Captain');
      });
  });
});
