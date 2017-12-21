'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory.js');
const soundMockFactory = require('./lib')


describe('/sounds', () => {
  beforeEach(server.start);
  afterEach(server.stop);
  afterEach(soundMockFactory.remove);

  
  test('POST /sounds should return 200 and sound if no ERRORS', () => {
    let tempAccountMock = null;
    return accountMockFactory.create()
    .then()
  });
  
});
