'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const videoMockFactory = require('./lib/video-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;





describe('POST: /videos', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(videoMockFactory.remove);

  test('...should return a 200 status code and a video object', () => {

    return accountMockFactory.create()
      .then(accountMock => {

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(response => {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('chimp-and-lion');
            expect(response.body._id).toBeTruthy();
            expect(response.body.url).toBeTruthy();
          })
          .catch(error => {
            expect(error).toBeFalsy();
          });
      });
  });

  test('...should return a 400 status code', () => {

    return accountMockFactory.create()
      .then(accountMock => {

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${accountMock.token}`)
          .field('fail','chimp-and-lion')
          .attach('poop',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then()
          .catch(error => {
            expect(error.status).toEqual(400);
          });
      });
  });

  test('...should return a 401 status code', () => {

    return accountMockFactory.create()
      .then(() => {

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer xX-FAILURE-Xx`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then()
          .catch(error => {
            expect(error.status).toEqual(401);
          });
      });
  });
}); //end POST /videos describe block




describe('GET: /videos/:id', () => {

  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(videoMockFactory.remove);

  test('...should return a 200 status code and a video object', () => { // expect response fields to be truthy, status to be 200

    return videoMockFactory.create()
      .then(videoMock => {

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(response => {
            let s3FileName = response.body.s3FileName;

            return superagent.get(`${apiURL}/videos/${s3FileName}`)
              .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
              .then(response => {
                expect(response.status).toEqual(200);
                let body = response.body;
                expect(body.AcceptRanges).toBeTruthy();
                expect(body.LastModified).toBeTruthy();
                expect(body.ContentLength).toBeTruthy();
                expect(body.ETag).toBeTruthy();
                expect(body.ContentType).toBeTruthy();
                expect(body.Metadata).toBeTruthy();
                expect(body.Body).toBeTruthy();
              });
          });
      })
      .catch(error => {
        expect(error).toBeFalsy();
      });
  });

  test('...should return a 401 status code', () => {// Send in no bearer auth, expect status to be 401

    return videoMockFactory.create()
      .then(videoMock => {

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(response => {
            let s3FileName = response.body.s3FileName;

            return superagent.get(`${apiURL}/videos/${s3FileName}`)
              .set('Authorization',`Bearer xX-FAILURE-Xx`)
              .then()
              .catch(error => {
                expect(error.status).toEqual(401);
              });
          });
      });
  });

  test('...should return a 404 status code', () => {// Send in failing id, expect status to be 404

    return videoMockFactory.create()
      .then(videoMock => {

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(() => {

            return superagent.get(`${apiURL}/videos/xX-FAILURE-Xx`)
              .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
              .then(response => {
                expect(response.statusCode).toEqual(404);
              })
              .catch(error => error);
          });
      });
  });
}); // end GET /videos/:id describe block




describe('DELETE /videos/:id', () => {

  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(videoMockFactory.remove);

  test('...should return a 204 status code', () => {

    return videoMockFactory.create()
      .then(videoMock => {

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(response => {
            let s3FileName = response.body.s3FileName;

            return superagent.delete(`${apiURL}/videos/${s3FileName}`)
              .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
              .then(response => {
                expect(response.statusCode).toEqual(204);
              });
          });
      })
      .catch(error => {
        expect(error).toBeFalsy();
      });
  });

  test('...should return a 401 status code', () => {// Send in no bearer auth, expect status to be 401

    return videoMockFactory.create()
      .then(videoMock => {

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(response => {
            let s3FileName = response.body.s3FileName;

            return superagent.delete(`${apiURL}/videos/${s3FileName}`)
              .set('Authorization',`Bearer xX-FAILURE-Xx`)
              .then()
              .catch(error => {
                expect(error.status).toEqual(401);
              });
          });
      });
  });

  test('...should return a 404 status code', () => {// Send in failing id, expect status to be 404

    return videoMockFactory.create()
      .then(videoMock => {

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(() => {

            return superagent.delete(`${apiURL}/videos/xX-FAILURE-Xx`)
              .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
              .then(response => {
                expect(response.statusCode).toEqual(404);
              })
              .catch(error => {
                error;
              });
          });
      });
  });

});
