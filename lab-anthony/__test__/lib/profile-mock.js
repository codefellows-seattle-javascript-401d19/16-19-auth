'use strict';
// TODO
const faker = require('faker');
const accountMockFactory = require('./account-mock');
const Profile = require('../../model/profile');

const profileMockFactory = module.exports = {};

profileMockFactory.create = () => {
  let resultMock = {};

  return accountMockFactory.create()
  .then(accountMock => {
    resultMock.accountMock = accountMock;

    return new Profile({
      bio: faker.lorem.words(20),
      avatar: faker.lorem.words(),
      lastName: faker.lorem.words(1),
      firstName: faker.lorem.words(1),

      account: accountMock.account._id,
    }).save();
  })
  .then(profile => {
    resultMock.profile = profile;
    return resultMock;
  });
};

profileMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Profile.remove({}),
  ]);
};
