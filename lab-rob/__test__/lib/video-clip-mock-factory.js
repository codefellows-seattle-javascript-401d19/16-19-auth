'use strict';

const faker = require('faker');
const accountMockFactory = require('./account-mock-factory');
const VideoClip = require('../../model/video-clip');

const videoClipMockFactory = module.exports = {};

videoClipMockFactory.create = () => {
  let mock = {};

  return accountMockFactory.create()
    .then(mockAccount => {
      mock.accountMock = mockAccount;

      return new VideoClip({
        title: faker.random.words(10),
        url: faker.image.imageUrl(),
        duration: Math.floor(Math.random() * 300),
        location: faker.address.city(),
        account: mockAccount.account._id,
        key: faker.lorem.word(),
      }).save();
    })
    .then(videoClip => {
      mock.videoClip = videoClip;
      return mock;
    });
};

videoClipMockFactory.remove = () => {
  return Promise.all([
    accountMockFactory.remove(),
    VideoClip.remove({}),
  ]);
};