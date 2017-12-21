'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const soundMockFactory = require('./lib/sound-mock-factory');

const apiUrl =`http://localhost:${process.env.PORT}`;

describe('/sounds', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(soundMockFactory.remove);

  test('POST should return 200 and a sound if no errors', () => {
    let accountMock = null;

    return accountMockFactory.create()
      .then(mock => {
        accountMock = mock;
        return superagent.post(`${apiUrl}/sounds`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .field('title', 'human barks')
          .attach('sound', `${__dirname}/asset/human.wav`)
          .then(response => {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('human barks');
            expect(response.body._id).toBeTruthy();
            expect(response.body.url).toBeTruthy();
          });
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Nicholas');
      });
  });
});
