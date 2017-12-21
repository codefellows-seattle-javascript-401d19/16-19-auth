'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');// vinicio - might refactor this to HttpErrors
const Hero = require('../model/hero');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const heroRouter = module.exports = new Router();

heroRouter.post('/heroes',bearerAuthMiddleware,jsonParser, (request,response,next) => {
  if(!request.account)
    return next(new httpErrors(404,'_ERROR_ not found'));

  return new Hero({
    ...request.body,
    account : request.account._id,
  }).save()
  .then(hero => response.json(hero))
  .catch(next);
});

heroRouter.get('/heroes/:id', bearerAuthMiddleware, (request,response,next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));

  Hero.findById(request.params.id)
    .then(hero => {
      response.json(hero);
    })
    .catch(next);

});