'use strict';

const faker = require('faker');
const accountMockFactory = require('./account-mock-factory');
const Gif = require('../../model/gif');

const gifMockFactory = module.exports = {};

gifMockFactory.create = () => {
  let mock = {};
  return accountMockFactory.create()
    .then(accountMock => {
      mock.accountMock = accountMock;
      return new Gif({
        account : accountMock.account._id,
        title : faker.lorem.words(10),
        url : faker.random.image(),
      }).save();
    })
    .then(gif => {
      mock.gif = gif;
      return mock;
    });
};

gifMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Gif.remove({}),
  ]);
};
