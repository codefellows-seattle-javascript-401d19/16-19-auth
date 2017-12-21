'use strict';

require('../lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const profileMockFactory = require('./lib/profile-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('POST/ profiles', () => {
	beforeAll(server.start);
	afterAll(server.stop);
	afterEach(profileMockFactory.remove);

	test('Should respond with a 200 and a profile if there are no errors', () => {
		let accountMock = null; //this is done to mimic lower level languages which might not create the variable without first giving it a value or null 

		return accountMockFactory.create()
			.then(mock => {
				accountMock = mock;
				return superagent.post(`${apiURL}/profiles`)
					.set('Authorization', `Bearer ${accountMock.token}`)
					.send({
						bio: 'I am a cat',
						firstName: 'Gregor',
						lastName: 'Samsa',
					});
			})
			.then(response => {
				expect(response.status).toEqual(200);
				expect(response.body.account).toEqual(accountMock.account._id.toString());
				expect(response.body.firstName).toEqual('Gregor');
				expect(response.body.lastName).toEqual('Samsa');
				expect(response.body.bio).toEqual('I am a cat');
			});
	});
});