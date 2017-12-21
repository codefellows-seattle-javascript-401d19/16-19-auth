'use strict';

const faker = require('faker');
const accountMock = require('./account-mock');
const Profile = require('../../model/profile');

const profileMock = module.exports = {};

profileMock.create = () => {
  let resultMock = {};

  return accountMock.create()
    .then(newAccount => {
      resultMock.account = newAccount;
      return new Profile({
        bio: faker.lorem.words(100),
        avatar: faker.random.image(),
        lastName: faker.name.lastName(),
        firstName: faker.name.firstName(),
        account: accountMock.account._id,
      }).save();
    })
    .then(newProfile => {
      resultMock.profile = newProfile;
      return resultMock;
    });
};

profileMock.remove = () => {
  return Promise.all([
    accountMock.remove(),
    Profile.remove({}),
  ]);
};