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
            //console.log(`SA POST RETURNED: ${JSON.stringify(response.body)}`);
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('chimp-and-lion');
            expect(response.body._id).toBeTruthy();
            expect(response.body.url).toBeTruthy();
          })
          .catch(error => {
            console.log(error);
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

});

describe('GET: /videos/:id', () => {

  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(videoMockFactory.remove);

  test('...should return a 200 status code and a video object', () => { // expect response fields to be truthy, status to be 200

    return videoMockFactory.create()
      .then(videoMock => {
        console.log(`VMF RETURNED : ${JSON.stringify(videoMock)}`);

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(response => {
            console.log(`SA POST RETURNED: ${JSON.stringify(response.body)}`);
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
        console.log('G-POS', error);
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
            //console.log(`SA POST RETURNED: ${JSON.stringify(response.body)}`);
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
        console.log(`VMF RETURNED : ${JSON.stringify(videoMock)}`);

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(response => {
            console.log(`SA POST RETURNED: ${JSON.stringify(response.body)}`);

            return superagent.get(`${apiURL}/videos/xX-FAILURE-Xx`)
              .set('Authorization',`Bearer ${videoMock.accountMock.token}`)
              .then()
              .catch(error => {
                console.log('3', error);
                expect(error.status).toEqual(401);
              });
          });
      });
  });
}); // end GET /videos/:id describe block

//   test('DELETE /videos/:id should return a 204 status code', () => {

// beforeAll(server.start);
// afterAll(server.stop);
// afterEach(videoMockFactory.remove);
//
//     // videomockfactory.create() -> save to var
//     // superagent POST
//     // .set auth bearer
//     // .field title mock.title
//     // . attach video chimp and Location
//     // then respose -> save to var`
//     // superagent.delete[id]() -> save to var
//     // expect response status to be 204
//
//     let tempAccountMock = null;
//     return accountMockFactory.create()
//       .then(accountMock => {
//         tempAccountMock = accountMock;
//
//         return superagent.post(`${apiURL}/videos`)
//           .set('Authorization',`Bearer ${accountMock.token}`)
//           .field('title','chimp-and-lion')
//           .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
//           .then(response => {
//             console.log(response.body);
//             expect(response.status).toEqual(200);
//             expect(response.body.title).toEqual('chimp-and-lion');
//             expect(response.body._id).toBeTruthy();
//             expect(response.body.url).toBeTruthy();
//           })
//           .catch(error => {
//             console.log(error);
//             expect(error).toBeFalsy();
//           });
//       });
//   });
//
// });
