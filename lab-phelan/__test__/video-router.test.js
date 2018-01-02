'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const videoMockFactory = require('./lib/video-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/videos', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(videoMockFactory.remove);

  test('POST /videos should return a 200 status code and a video object', () => {
    let tempAccountMock = null;
    return accountMockFactory.create()
      .then(accountMock => {
        tempAccountMock = accountMock;

        return superagent.post(`${apiURL}/videos`)
          .set('Authorization',`Bearer ${accountMock.token}`)
          .field('title','chimp-and-lion')
          .attach('video',`${__dirname}/asset/chimp-and-lion.mp4`)
          .then(response => {
            console.log(`SA POST RETURNED: ${JSON.stringify(response.body)}`);
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

  test('GET /videos/:id should return a 200 status code and a video object', () => {

  // expect response fields to be truthy, status to be 200

    console.log(`TEST STARTED`);

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
                // console.log(`SA GET RETURNED: response:  ${JSON.stringify(Object.keys(response))}`);
                // console.log(`SA GET RETURNED: response.res:  ${JSON.stringify(Object.keys(response.res))}`);
                // console.log(`SA GET RETURNED: response.req:  ${JSON.stringify(Object.keys(response.req))}`);
                // console.log(`SA GET RETURNED: response.request:  ${JSON.stringify(Object.keys(response.request))}`);
                // console.log(`SA GET RETURNED: response.body:  ${JSON.stringify(Object.keys(response.body))}`);

                let body = response.body;

                expect(response.status).toEqual(200);
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
        console.log('3', error);
        expect(error).toBeFalsy();
      });
  });

  test.only('GET /videos/:id should return a 200 status code and a video object', () => {

  // Send in no bearer auth, expect status to be 401

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
              .then()
              .catch(error => {
                console.log('3', error);
                expect(error.status).toEqual(400);
              });
          });
      });
  });

  test('GET /videos/:id should return a 200 status code and a video object', () => {

  // Send in dumb id, expect status to be 404

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

//   test('DELETE /videos/:id should return a 204 status code', () => {
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


});
