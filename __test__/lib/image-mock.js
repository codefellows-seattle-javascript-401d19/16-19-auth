'use strict';

const faker = require('faker');
const accountMock = require('./account-mock');
const Image = require('../../model/image');

const imageMock = module.exports = {};

imageMock.create = () => {
  let mock = {};

  return accountMock.create()
    .then(accountToMock => {
      mock.accountToMock = accountToMock;
      return new Image({
        account : accountToMock.account._id,
        title : faker.lorem.words(),
        url : faker.random.image(),
      }).save();
    })
    .then(image => {
      mock.image = image;
      return mock;
    }); 
};

imageMock.remove = () => {
  return Promise.all([
    accountMock.remove(),
    Image.remove({}),
  ]);
};