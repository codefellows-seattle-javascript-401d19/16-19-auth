'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Profile = require('../model/profile');
const httpErrors = require('http-errors'); 

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware')

const profileRouter = module.exports = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
	if (!request.account)
		return next(new httpErrors(404, '__ERROR__ Not found.'));

	return new Profile({
		...request.body,
		account: request.account._id,
	}).save()
		.then(profile => response.json(profile))
		.catch(next);
});
