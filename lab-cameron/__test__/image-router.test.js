'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const imageMockFactory = require('./lib/image-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('image-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(imageMockFactory.remove);

  test('POST /images should return a 200 status code and a sound if there are no errors', () => {
    let tempAccountMock = null;
    return accountMockFactory.create()
      .then(accountMock => {
        tempAccountMock = accountMock;

        return superagent.post(`${apiURL}/images`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .field('title', 'test dog')
          .attach('image', `${__dirname}/asset/dog.jpeg`)
          .then(response => {
            console.log(response.body);
            expect(response.status).toEqual(200);
          });
      });
  });
});
