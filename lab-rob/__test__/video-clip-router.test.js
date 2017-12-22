'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const videoClipMockFactory = require('./lib/video-clip-mock-factory');

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('video-clip-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(videoClipMockFactory.remove);

  describe('POST /video-clips', () => {
    test('should respond with a 200 status code and video document if no errors.', () => {

      return accountMockFactory.create()
        .then(accountMock => {
          return superagent.post(`${apiUrl}/video-clips`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', 'Come Sail Away - Kishi Bashi')
            .attach('video-clip', `${__dirname}/assets/kishi.MOV`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Come Sail Away - Kishi Bashi');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
    });
  });
});