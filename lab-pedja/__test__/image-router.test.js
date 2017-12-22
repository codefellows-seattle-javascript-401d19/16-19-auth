'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const imageMock = require('./lib/image-mock');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/images', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(imageMock.remove);
  
  test('POST /images should return 200 status code and an image if there is no errors', () => {
    let accountToMock = null;
    return accountMock.create()
      .then(mock => {
        accountToMock = mock;
        
        return superagent.post(`${apiURL}/images`)
          .set('Authorization', `Bearer ${accountToMock.token}`)
          .field('title', 'hero image')
          .attach('sound', `${__dirname}/asset/hero.jpg`)
          .then(response => {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('hero image');
            expect(response.body._id).toBeTruthy();
            expect(response.body.url).toBeTruthy();
          });
      });
  });
});