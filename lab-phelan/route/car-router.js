'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Profile = require('../model/car');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const carRouter = module.exports = new Router();

carRouter.post('/cars',bearerAuthMiddleware,jsonParser,
  (request,response,next) => {
    if(!request.account)
      return next(new httpErrors(404,'__ERROR__ not found'));

    return new Profile({
      ...request.body,
      account : request.account._id,
    }).save()
    .then(car => response.json(car))
    .catch(next);
});
