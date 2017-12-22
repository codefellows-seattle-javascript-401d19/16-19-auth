'use strict';

const faker = require('faker');
const Account = require('../../model/account');


const accountMockFactory = module.exports = {};

accountMockFactory.create = () => {
  let mock = {};
  mock.request = {
    username : faker.internet.username(),
    email : faker.internet.email(),
    password : faker.loren.words(10),
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
