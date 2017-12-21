'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const profileMockFactory = require('./lib/profile-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMockFactory.remove);

  test('should return a 200 and a profile if there are no errors', () => {
    let accountMock = null;

    return accountMockFactory.create()
      .then(mock => {
        accountMock = mock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .send({
            bio : 'I am the president',
            firstName : 'Zaphod',
            lastName : 'Beeblebrox',
          });
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Zaphod');
        expect(response.body.lastName).toEqual('Beeblebrox');
        expect(response.body.bio).toEqual('I am the president');
      });
  });

  test('should return a 400 for an incomplete request', () => {
    return superagent.post(`${apiURL}/profiles`)
      .send({
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status).toEqual(400);
      });
  });

  test('should return a 404 for a bad request', () => {
    let accountMock = null;

    return accountMockFactory.create()
      .then(mock => {
        accountMock = mock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .send({
            bio : 'I am the president',
            firstName : 'Zaphod',
          });
      })
      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Zaphod');
        expect(response.body.bio).toEqual('I am the president');
      });
  });

});