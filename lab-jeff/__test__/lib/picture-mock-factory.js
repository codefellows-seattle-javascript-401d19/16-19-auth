'use strict';

const faker = require('faker');
const accountMockFactory = require('./account-mock-factory');
const Picture = require('../../model/picture');

const soundMockFactory = module.exports = {};

soundMockFactory.create = () => {
  let mock = {};

  return accountMockFactory.create()
    .then(accountMock => {
      mock.accountMock = accountMock;
      return new Picture({
        account: accountMock.account._id,
        title: faker.lorem.words(10),
        url: faker.image.image(),
      }).save();
    })
    .then(picture => {
      mock.picture = picture;
      return mock;
    });
};

soundMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Picture.remove({}),
  ]);
};
