'use strict';

const faker
const accountMockFactory
const Sound

const soundMockFactory = module.exports = {};

soundMockFactory.create = () => {
  let mock = {} 
    return accountMockFactory.create()
    .then(accountMock => {
      mock.account = account;
      return new Sound({
        account : accountMock.account._id,
        title : faker.lorem.words(10),
        url : faker.random.image(),
      }).save();
    })
    .then(sound => {
      mock.sound = sound;
      return mock;
    });
};

soundMockFactory.remove = () => {
  return Promise.all([

  ])
}