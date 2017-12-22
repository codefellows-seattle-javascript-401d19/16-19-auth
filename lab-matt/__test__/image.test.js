'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const imageMock = require('./lib/image-mock');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('IMAGES', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(imageMock.remove);

  describe('POST /images', () => {
    test('POST ', () => {
      let mockAccount = null;
      return accountMock.create()
        .then(newAccount => {
          mockAccount = newAccount;

          return superagent.post(`${__API_URL__}/images`)
            .set('Authorization', `Bearer ${mockAccount.token}`)
            .field('title', 'Demi')
            .attach('image', `${__dirname}/assets/demi.jpg`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Demi');
          expect(response.body.url).toBeTruthy();
          expect(response.body._id).toBeTruthy();
        });
    });
  });
});