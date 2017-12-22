'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const carMockFactory = require('./lib/car-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /cars', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(carMockFactory.remove);

  test('Should return a profile and a 200 status code.', () => {
    let accountMock = null;

    return accountMockFactory.create()
      .then(mock => {
        accountMock = mock;
        return superagent.post(`${apiURL}/cars`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .send({
            publicName : 'The Dirge Dort',
            prodName : 'EMW-DGDT-00-A1',
            description : 'Definitely not the Dodge Dart. No relation whatsoever. This car actually has wheels.',
          });
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.publicName).toEqual('The Dirge Dort');
        expect(response.body.prodName).toEqual('EMW-DGDT-00-A1');
        expect(response.body.description).toEqual('Definitely not the Dodge Dart. No relation whatsoever. This car actually has wheels.');
      });
  });
});
