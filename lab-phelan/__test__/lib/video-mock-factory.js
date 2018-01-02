'use strict';

const faker = require('faker');
const accountMockFactory = require('./account-mock-factory');
const Video = require('../../model/video');

const videoMockFactory = module.exports = {};

videoMockFactory.create = () => {
  let mock = {};

  return accountMockFactory.create()
    .then(accountMock => {
      mock.accountMock = accountMock;
      return new Video({
        account : accountMock.account._id,
        title : faker.lorem.words(2),
        url : faker.random.image(),
      }).save();
    })
    .then(video => {
      mock.video = video;
      return mock;
    });
};

videoMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    Video.remove({}),
  ]);
};
