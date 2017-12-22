'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const pictureMockFactory = require('./lib/picture-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/pictures', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(pictureMockFactory.remove);

  describe('POST', () => {
    test('should return 200 and a picture if no errors', () => {
      let tempAccountMock = null;
      return accountMockFactory.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', 'Thor Dog')
            .attach('picture', `${__dirname}/asset/dog-thor.jpg`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('Thor Dog');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });

    test('should return 400 if incorrect field information is sent', () => {
      let tempAccountMock = null;
      return accountMockFactory.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('not a valid field', 'Thor Dog')
            .attach('picture', `${__dirname}/asset/dog-thor.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('should return 401 if a bad token is sent', () => {
      let tempAccountMock = null;
      return accountMockFactory.create()
        .then(accountMock => {
          tempAccountMock = accountMock;

          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization', `Bearer ${accountMock.token}1`)
            .field('title', 'Thor Dog')
            .attach('picture', `${__dirname}/asset/dog-thor.jpg`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(401);
            });
        });
    });

  });
});
