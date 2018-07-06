'use strict';

const faker = require('faker');
const accountMockFactory = require('./account-mock');
const Picture = require('../../model/picture');

const pictureMockFactory = module.exports = {};

pictureMockFactory.create = () => {
  let mock = {};

  return accountMockFactory.create()
    .then(accountMock => {
      mock.accountMock = accountMock;
      return new Picture({
        account : accountMock.account._id,
        title : faker.lorem.words(10),
        url : faker.random.image(),
      }).save();
    })
    .then(picture => {
      mock.picture = picture;
      return mock;
    });
};

pictureMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Picture.remove({}),
  ]);
};
