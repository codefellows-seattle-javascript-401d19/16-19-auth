'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Profile = require('../model/profile');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const profileRouter = module.exports = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware,jsonParser, (request,response,next) => {
  if(!request.account)
    return next(new httpErrors(404, 'ERROR not found'));

  return new Profile({
    ...request.body,
    account : request.account._id,
  }).save()
  .then(profile => response.json(profile))
  .catch(next);
});

profileRouter.get('/profiles/:id', bearerAuthMiddleware, (request,response,next) => {

  return Profile.findById(request.params.id)
    .then(profile => {
      if(!profile)
        return next(new httpErrors(404, 'ERROR not found'));
      return response.json(profile);
    })
    .catch(next);
});