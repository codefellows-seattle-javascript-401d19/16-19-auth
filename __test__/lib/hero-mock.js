'use strict';

const faker = require('faker');
const accountMock = require('./account-mock');
const Hero = require('../../model/hero');

const heroMock = module.exports = {};

heroMock.create = () => {
  let resultMock = {};

  return accountMock.create()
    .then(accountToMock => {
      resultMock.accountToMock = accountToMock;

      return new Hero({
        name : faker.name.firstName(),
        sidekick : faker.name.firstName(),
        superpower : faker.random.word(),
        catchphrase : faker.hacker.phrase(),

        account : accountToMock.account._id,
      }).save();
    })
    .then(hero => {
      resultMock.hero = hero;
      return resultMock;
    });
};

heroMock.remove = () => {
  return Promise.all([
    accountMock.remove(),
    Hero.remove({}),
  ]);
};