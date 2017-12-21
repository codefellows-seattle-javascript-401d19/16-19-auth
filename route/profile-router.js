'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Profile = require('../model/profile');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const profileRouter = module.exports = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account)
    return next(new httpErrors(404, '_ERROR_ not found'));

  return new Profile({
    ...request.body,
    account: request.account._id,
  }).save()
    .then(profile => response.json(profile))
    .catch(next);
});
//TODO: ADD GET ROUTE
profileRouter.get('/profiles/:id', bearerAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return new httpErrors(404, '_ERROR_ not found');

  return Profile.findById(request.params.id)
    .then(profile => response.json(profile))
    .catch(next);
});

