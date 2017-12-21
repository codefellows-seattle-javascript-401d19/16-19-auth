'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const profileMockFactory = require('./lib/profile-mock-factory');

const apiUrl =`http://localhost:${process.env.PORT}`; //TODO : give/signup to post routes

describe('POST /profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMockFactory.remove);

  test('should return 200 and profile if no errors', () => {
    let accountMock = null;

    return accountMockFactory.create()
      .then(mock => {
        accountMock = mock;
        return superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .send({
            bio : 'I am a nicholas',
            firstName : 'Nicholas',
            lastName : 'Carignan',
          });
      })
      .then(response => {
        console.log(response.body);
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());//TODO: remove this NOTE: we would need to call a .populate to have account be the actual object instead of an id
        expect(response.body.firstName).toEqual('Nicholas');
      });
  });
});
