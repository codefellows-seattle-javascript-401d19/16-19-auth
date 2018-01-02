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

  test.only('GET /videos/:id should return a 200 status code and a video object', () => {

  // expect response to be truty, status to be 200

    let vMock = null;
    let s3File = null;

    console.log(`TEST STARTED`);

    return videoMockFactory.create()
      .then(videoMock => {
        console.log(`VMF RETURNED : ${JSON.stringify(videoMock)}`);
        vMock = videoMock;

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
                console.log(`SA GET RETURNED: ${JSON.stringify(response)}`);
                //expects go here
                expect(response.status).toEqual(200);
                //expect(response.body.title).toEqual('chimp-and-lion');
                //expect(response.body._id).toBeTruthy();
                //expect(response.body.url).toBeTruthy();
              })
              .catch(error => {
                console.log('1', error);
                expect(error).toBeFalsy();
              });
          })
          .catch(error => {
            console.log('2', error);
            expect(error).toBeFalsy();
          });
      })
      .catch(error => {
        console.log('3', error);
        expect(error).toBeFalsy();
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
