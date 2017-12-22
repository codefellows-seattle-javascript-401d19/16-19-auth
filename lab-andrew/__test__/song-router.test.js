'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const songMock = require('./lib/song-mock');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('Song router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(songMock.remove);

  describe('POST /songs', () => {
    test('POST /songs should return a 200 status and a song if there are no errors', () => {
      let tempAccountMock = null;
      return accountMock.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${__API_URL__}/songs`)
            .set('Authorization', `Bearer ${tempAccountMock.token}`)
            .field('title', 'nyancat')
            .attach('song', `${__dirname}/asset/nyancat.mp3`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('nyancat');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });

    test('POST /songs should return a 400 status and a song if there are no errors', () => {
      let tempAccountMock = null;
      return accountMock.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${__API_URL__}/songs`)
            .set('Authorization', `Bearer ${tempAccountMock.token}`)
            .field('thing', 'nyancat')
            .attach('song', `${__dirname}/asset/nyancat.mp3`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('POST /songs should return a 401 status and a song if there are no errors', () => {
      return accountMock.create()
        .then(() => superagent.post(`${__API_URL__}/songs`)
          .set('Authorization', 'Bearer ofBadTokens')
          .field('field', 'nyancat')
          .attach('song', `${__dirname}/asset/nyancat.mp3`)
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(401);
          }));
    });
  });

});