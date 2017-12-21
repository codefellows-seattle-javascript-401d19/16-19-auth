'use strict';

const faker = require('faker');
const accountMock = require('./account-mock');
const Hero = require('../../model/hero');

const heroMock = module.exports = {};

heroMock.create = () => {
  let resultMock = {};
  return accountMock.create()
    .then(accountMock => {
      resultMock.accountMock = accountMock;

      return new Promise({
        name : faker.name.firstName(),
        sidekick : faker.name.firstName(),
        superpower : faker.random.word(),
        catchphrase : faker.hacker.phrase(),

        account : accountMock.account._id,
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