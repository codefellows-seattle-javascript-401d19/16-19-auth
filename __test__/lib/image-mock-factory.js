'use strict';

const faker = require('faker');
const accountMockFactory = require('./account-mock-factory');
const Image = require('../../model/image');

const imageMockFactory = module.exports = {};

imageMockFactory.create = () => {
  let mock = {};

  return accountMockFactory.create()
    .then(accountMock => {
      mock.accountMock = accountMock;
      return new Image({
        account: accountMock.account._id,
        title: faker.lorem.words(5),
        url: faker.random.image(),
      }).save();
    })
    .then(image => {
      mock.image = image;
      return mock;
    });
};

imageMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Image.remove({}),
  ]);
};