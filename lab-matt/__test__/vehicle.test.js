'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('../__test__/lib/account-mock');
const vehicleMock = require('../__test__/lib/vehicle-mock');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('VEHICLES', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(vehicleMock.remove);

  describe('POST /vehicles', () => {
    test('returns a 200 and vehicle data if no erros', () => {
      let mockAccount = null;

      return accountMock.create()
        .then(mock => {
          mockAccount = mock;
          return superagent.post(`${__API_URL__}/vehicles`)
            .set('Authorization', `Bearer ${mockAccount.token}`)
            .send({
              vehicleType: 'motorcycle',
              capacity: 2,
              wheels: 2,
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(mockAccount.account._id.toString());
          expect(response.body.vehicleType).toEqual('motorcycle');
          expect(response.body.capacity).toEqual(2);
          expect(response.body.wheels).toEqual(2);
          expect(response.body._id).not.toEqual(response.body.account);
        });
    });

    test('returns a 400 due to a bad request', () => {
      let mockAccount = null;

      return accountMock.create()
        .then(mock => {
          mockAccount = mock;
          return superagent.post(`${__API_URL__}/vehicles`)
            .set('Authorization', `Bearer ${mockAccount.token}`)
            .send({
              capacity: 2,
              wheels: 2,
            });
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(400);
        });
    });
    
    test('returns a 401 due to a bad token', () => {
      return superagent.post(`${__API_URL__}/vehicles`)
        .set('Authorization', `Bearer unAuthorizedToken`)
        .send({
          vehicleType: 'motorcycle',
          capacity: 2,
          wheels: 2,
        })
        .then(Promise.reject)
        .catch(error => {
          expect(error.status).toEqual(401);
        });
    });
  });
});