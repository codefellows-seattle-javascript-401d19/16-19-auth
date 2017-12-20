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
  afterEach(accountMock.remove);

  describe('POST /profiles', () =>{
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

  });
});