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
            .field({
              title: 'Come Sail Away - Kishi Bashi',
              duration: 200,
              location: 'Seattle, WA',
            })
            .attach('video-clip', `${__dirname}/assets/kishi.MOV`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Come Sail Away - Kishi Bashi');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
    });

    test('should respond with a 400 status if missing the title field.', () => {
      return accountMockFactory.create()
        .then(accountMock => {
          return superagent.post(`${apiUrl}/video-clips`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field({
              duration: 200,
              location: 'Seattle, WA',
            })
            .attach('video-clip', `${__dirname}/assets/kishi.MOV`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should respond with a 401 status if missing the correct authorization.', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiUrl}/video-clips`)
            .set('Authorization', `Bearer bad token`)
            .field({
              title: 'Come Sail Away - Kishi Bashi',
              duration: 200,
              location: 'Seattle, WA',
            })
            .attach('video-clip', `${__dirname}/assets/kishi.MOV`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });

  describe('GET /video-clips/:id', () => {
    test('should respond with a 200 and document if no errors', () => {
      let mock = null;
      return videoClipMockFactory.create()
        .then(mockData => {
          mock = mockData;

          return superagent.get(`${apiUrl}/video-clips/${mock.videoClip._id}`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(mock.videoClip.title);
          expect(response.body.duration).toEqual(mock.videoClip.duration);
          expect(response.body.location).toEqual(mock.videoClip.location);
          expect(response.body.url).toEqual(mock.videoClip.url);
          expect(response.body.account).toEqual(mock.videoClip.account.toString());
        });
    });

    test('should respond with a 404 if a bad id is provided', () => {
      return videoClipMockFactory.create()
        .then(mock => {
          return superagent.get(`${apiUrl}/video-clips/bad-id`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('should respond with a 401 if bad bearer auth sent', () => {
      let mock = null;
      return videoClipMockFactory.create()
        .then(mockData => {
          mock = mockData;

          return superagent.get(`${apiUrl}/video-clips/${mock.videoClip._id}`)
            .set('Authorization', `Bearer bad stuff`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});