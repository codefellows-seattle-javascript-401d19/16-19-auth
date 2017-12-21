'use strict';

const faker = require('faker');
const accountMockFactory = require('./account-mock-factory');
const Movie = require('../../model/movie');

const movieMockFactory = module.exports = {};

movieMockFactory.create = () => {
  let resultMock = {};

  return accountMockFactory.create()
    .then(accountMock => {
      resultMock.accountMock = accountMock;

      return new Movie({
        title: faker.random.words(4),
        lead: faker.name.firstName() + faker.name.lastName(),
        year: Math.floor(Math.random() * 70) + 1947,
        synopsis: faker.random.words(100),
      }).save();
    })
    .then(movie => {
      resultMock.movie = movie;
      return resultMock;
    });
};

movieMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Movie.remove({}),
  ]);
};