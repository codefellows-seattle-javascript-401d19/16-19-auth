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

  test('Should return a car and a 200 status code.', () => {
    let accountMock = null;

    return accountMockFactory.create()
      .then(mock => {
        console.log(`POST /cars after accountMockFactory: ${JSON.stringify(mock)}`);
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
        expect(response.body.accountId).toEqual(accountMock.account._id.toString());
        expect(response.body.publicName).toEqual('The Dirge Dort');
        expect(response.body.prodName).toEqual('EMW-DGDT-00-A1');
        expect(response.body.description).toEqual('Definitely not the Dodge Dart. No relation whatsoever. This car actually has wheels.');
      });
  });
});

// describe GET cars WITH id
// test: should respond with a 1. populated object 2. whose ID matches the sent-in ID 3. and a 200 status code
// carMockFactory.create => (returns a whole car object)
// Make a car.
// Cache the returned car.
// Call the GET/car:id route with the ID of the returned car
// Upon return, validate that car returned from endpoint matches cached car

describe('GET /cars', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(carMockFactory.remove);

  test(`Should return the car with the given ID, and a 200 status code.`, () => {
    let carMock = {};

    carMockFactory.create()
      .then(carMock => {
        console.log(carMock);
        return superagent.get(`${apiURL}/cars/${carMock.car._id}`)
          .set('Authorization', `Bearer ${carMock.account.token}`);
      })
      .then(response => {
        console.log(response.status);
        console.log(JSON.stringify(response.body));
        console.log(JSON.stringify(carMock));
        expect(response.status).toEqual(400);
        expect(response.body.accountId).toEqual(carMock.account._id.toString());
        expect(response.body._id).toEqual(carMock.car._id.toString());
        expect(response.body.publicName).toEqual(carMock.car.publicName);
        expect(response.body.prodName).toEqual(carMock.car.prodName);
        expect(response.body.description).toEqual(carMock.car.description);
        expect(response.body.photo).toEqual(carMock.car.photo);
      });
  });
});
