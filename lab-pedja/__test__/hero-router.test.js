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

  describe('POST /heroes', () => { 
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

    test('POST should return 400 if invalid request', () => {
      let accountToMock = null;

      return accountMock.create()
        .then(mock => {
          accountToMock = mock;
          return superagent.post(`${apiURL}/heroes`)
            .set('Authorization', `Bearer ${accountToMock.token}`)
            .send({
              name : 'Rorschach',
              sidekick : {},
              superpower : 'crimebustering',
              catchphrase : '...and I\'ll look down and whisper - No',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    }); 

    test('POST should return 401 if invalid token is sent', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiURL}/heroes`)
            .set('Authorization', `Bearer badToken`)
            .send({
              name : 'Rorschach',
              sidekick : {},
              superpower : 'crimebustering',
              catchphrase : '...and I\'ll look down and whisper - No',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    }); 
  });

  // GET METHOD
  describe('GET /heroes/:id', () => {
    test('GET should return 200 if specific hero if there are no errors', () => {
      let resultMock = null;

      return heroMock.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/heroes/${resultMock.hero._id}`)
            .set('Authorization', `Bearer ${resultMock.accountToMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(resultMock.hero._id.toString());
          expect(response.body.name).toEqual(resultMock.hero.name);
          expect(response.body.superpower).toEqual(resultMock.hero.superpower);
          expect(response.body.sidekick).toEqual(resultMock.hero.sidekick);
        });
    });
    test('GET Should return a 404 if a bad id is sent', () => {
      let resultMock = null;

      return heroMock.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/heroes/invalidid`)
            .set('Authorization', `Bearer ${resultMock.accountToMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
    test('GET Should return a 401 if token is invalid', () => {
      let resultMock = null;

      return heroMock.create()
        .then(mock => {
          resultMock = mock;
          return superagent.get(`${apiURL}/heroes/${resultMock.hero._id}`)
            .set('Authorization', `Bearer badToken`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });



});