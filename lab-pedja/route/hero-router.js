'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Hero = require('../model/hero');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const heroRouter = module.exports = new Router();

heroRouter.post('/heroes', bearerAuthMiddleware, jsonParser, (request,response,next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));

  return new Promise({
    ...request.body,
    account : request.account._id,
  }).save()
  .then(hero => response.json(hero))
  .catch(next);
});

// GET METHOD

