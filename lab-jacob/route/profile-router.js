'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Profile = require('../model/profile');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const profileRouter = module.exports = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware,jsonParser, (request,reponse,next) => {
  if(!request.account)
    return next(new httpErrors(404, 'ERROR not found'));

  return new Profile({
    ...request.body,
    account : request.account._id,
  }).save()
  .then(profile => response.json(profile))
  .catch(next);
});