'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const heroMock = require('./lib/hero-mock');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /heroes', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(heroMock.remove);

  test('POST should return 200 and a hero if there are no errors', () => {
    let accountToMock = null;

    return accountMock.create()
      .then(mock => {
        accountToMock = mock;
        return superagent.post(`${apiURL}/heroes`)
          .set('Authorization', `Bearer ${accountToMock.token}`)
          .send({
            name : 'Rorschach',
            sidekick : 'Rorschach fights alone',
            superpower : 'strong will',
            catchphrase : '...and I\'ll look down and whisper - No',
          });
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountToMock.account._id.toString());
        expect(response.body.name).toEqual('Rorschach');
        expect(response.body.superpower).toEqual('strong will');
        expect(response.body.catchphrase).toEqual('...and I\'ll look down and whisper - No');
      });
  });
});