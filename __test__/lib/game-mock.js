'use strict';

const faker = require('faker');
const accountMock = require('./account-mock');
const Game = require('../../model/game');

const gameMock = module.exports = {};

gameMock.create = () => {
  let resultMock = {};

  return accountMock.create()
    .then(accountMock => {
      resultMock.accountMock = accountMock;

      return new Game({
        title: faker.random.words(4),
        type: faker.random.words(10),
        year: Math.floor(Math.random() * 70),
        account: accountMock.account._id,
      }).save();
    })
    .then(game => {
      resultMock.game = game;
      return resultMock;
    });
};

gameMock.remove = () => {
  return Promise.all([
    accountMock.remove(),
    Game.remove({}),
  ]);
};