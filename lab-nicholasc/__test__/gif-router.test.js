'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const gifMockFactory = require('./lib/gif-mock-factory');

const apiUrl =`http://localhost:${process.env.PORT}`;

describe('/gifs', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(gifMockFactory.remove);

  test('POST should return 200 and a gif if no errors', () => {
    let accountMock = null;

    return accountMockFactory.create()
      .then(mock => {
        accountMock = mock;
        return superagent.post(`${apiUrl}/gifs`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .field('title', 'cultivate-mass')
          .attach('gif', `${__dirname}/asset/cultivate-mass.gif`)
          .then(response => {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('cultivate-mass');
            expect(response.body._id).toBeTruthy();
            expect(response.body.url).toBeTruthy();
          });
      });
  });
  test('GET should return 200 and gif with id if no errors', () => {
    let gifToTest = null;
    return gifMockFactory.create()
      .then(gif => {
        gifToTest = gif;
        return superagent.get(`${apiUrl}/gifs/${gif.gif._id}`)
          .set('Authorization', `Bearer ${gif.accountMock.token}`);
      })
      .then(response => {
        expect(response.status).toEqual(200);
        console.log(response.body);
        expect(response.body.title).toEqual(gifToTest.gif.title);
        expect((response.body._id).toString()).toEqual((gifToTest.gif._id).toString());
      });
  });
});
