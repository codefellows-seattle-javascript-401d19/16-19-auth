'use strict';

const faker = require('faker');
const accountMockFactory = require('./account-mock-factory');
const Car = require('../../model/car');

const carMockFactory = module.exports = {};

carMockFactory.create = () => {
  let resultMock = {};

  return accountMockFactory.create()
    .then(accountMock => {
      resultMock.accountMock = accountMock;

      return new Car({
        publicName : `Model ${faker.lorem.words(2)}`,
        prodName : `EMW-${faker.lorem.words(1)}-${faker.lorem.words(1)}-00-A1`,
        decription : faker.lorem.words(100),
        photo : faker.random.image(),

        accountId : accountMock.account._id,
      }).save();
    })
    .then(car => {
      resultMock.car = car;
      return resultMock;
    });
};

carMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Car.remove({}),
  ]);
};
