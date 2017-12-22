'use strict';

const faker = require('faker');
const accountMockFactory = require('./account-mock-factory');
const Photo = require('../../model/photo');

const photoMockFactory = module.exports = {};

photoMockFactory.create = () => {
  let mock = {};
  return accountMockFactory.create()
    .then(accountMock => {
      mock.accountMock = accountMock;
      return new Photo({
        account: accountMock.account._id,
        title: faker.lorem.words(10),
        url: faker.random.image(),
      }).save();
    })
    .then(sound => {
      mock.sound = sound;
      return mock;
    });
};

photoMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Photo.remove({}),
  ]);
};