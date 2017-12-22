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

profileRouter.get('/profiles/:id', bearerAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return new httpErrors(404, '_ERROR_ not found');

  return Profile.findById(request.params.id)
    .then(profile => response.json(profile))
    .catch(next);
});

// //TODO: ADD PROFILE DELETE ROUTE
// DELETE / <resouces-name>/:id
// pass a bearer authentication token in the request to authorize the creation of the resource
// on success respond with a 204 status code and an authentication token
// on failure due to a bad id send a 404 status code
// on failure due to bad token or lack of token respond with a 401 status code
