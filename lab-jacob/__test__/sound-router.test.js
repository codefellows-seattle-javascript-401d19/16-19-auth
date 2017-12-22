'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const soundMockFactory = require('./lib/sound-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/sounds', () => {
  beforeEach(server.start);
  afterEach(server.stop);
  afterEach(soundMockFactory.remove);

  
  test('POST /sounds should return 200 and sound if no ERRORS', () => {
    let tempAccountMock = null;
    return accountMockFactory.create()
      .then(accountMock => {
        tempAccountMock = accountMock;

        return superagent.post(`${apiURL}/sounds`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .field('title', 'song')
          .attach('sound', `${__dirname}/asset/song.wav`)
          .then(response => {
            console.log(response.body);
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('song');
            expect(response.body._id).toBeTruthy();
            expect(response.body.url).toBeTruthy();
          });
      });
  });  
});
