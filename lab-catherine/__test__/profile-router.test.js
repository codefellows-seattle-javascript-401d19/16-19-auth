'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const profileMock = require('./lib/profile-mock');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/profiles', () => {
  test('Should return a 200 and a profile if there are no errors', () => {
    let accountMock = null;

    return accountMock.create()
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