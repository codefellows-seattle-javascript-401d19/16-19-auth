'use strict';

const faker = require('faker');
const Account = require('../../model/account');
const accountMock = module.exports = {};

accountMock.create = () => {
  let mock = {};
  mock.request = {
    username: faker.internet.userName(),
    password: faker.lorem.words(10),
    email: faker.internet.email(),
  };

  return Account.create(mock.request.username, mock.request.email, mock.request.password)
    .then(account => {
      mock.account = account;
      return account.createToken();
    })
    .then(token => {
      mock.token = token;
      return Account.findById(mock.account._id);
    })
    .then(account => {
      mock.account = account;
      return mock;
    });
};

accountMock.remove = () => Account.remove({});