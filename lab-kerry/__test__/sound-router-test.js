'use strict';

require('./lib/setup')

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const soundMockFactory = require('./lib/sound-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}/`;

describe('/sounds', () => {
	beforeAll(server.start);
	afterAll(server.stop);
	afterEach(soundMockFactory.remove);

	test('POST /sounds should return a 200 status code i fthere are no errors', () => {
		let tempAccountMock = null;

		return accountMockFactory.create()
			.then(accountMock => {
				tempAccountMock = accountMock;

				return superagent.post(`${apiURL}/sounds`)
					.set('Authorization', `Bearer ${accountMock.token}`)
					.field('title', 'dog barks')
					.attach('sound', `${__dirname}/asset/dog.wav`)
					.then(response => {
						expect(response.status).toEqual(200);
						expect(response.body).toEqual('dog barks');
						expect(response.body._id).toBeTruthy();
						expect(response.body.url).toBeTruthy();
					});
			})
	});
});