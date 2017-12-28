'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Profile = require('../model/profile');
const logger = require('../lib/logger');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const profileRouter = module.exports = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if(!request.account) {
    return next(new httpErrors(404,'_ERROR_ not found'));
  }

  return new Profile({
    ...request.body,
    account : request.account._id,
  }).save()
  .then(profile => response.json(profile))
  .catch(next);
});

profileRouter.get('/profiles/:id', bearerAuthMiddleware, (request, response, next) => {
  return Profile.findById(request.params.id)
    .then(profile => {
      if (!profile) {
        throw httpErrors(404, 'not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', profile);

      return response.json(profile);
    })
    .catch(next);
});
