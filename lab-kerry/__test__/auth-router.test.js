'use strict';

require('../lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('AUTH Router', () => {
	beforeAll(server.start);
	afterAll(server.stop);
	afterEach(accountMock.remove);

	test('POST creating an account should response with a 200 if there are no errors', () => {
		return superagent.post(apiURL)
			.send({
				username: 'kAry',
				email: 'kAry@kerry.com',
				password: 'kAryNation',
			})
			.then (response => {
				console.log(respose.body);
				expect(response.status).toEqual(200);
				expect(response.body.token).toBeTruthy();
			});
	});
});
