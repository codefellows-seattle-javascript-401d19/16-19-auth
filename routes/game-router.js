'use strict';

const {Router} = require('express');
const jsonParser = require('express').json();
const httpErrors = require('http-errors');
const Game = require('../model/game');
const bearerAuth = require('../lib/bearer-auth-middleware');

const gameRouter = module.exports = new Router();

gameRouter.post('/games', bearerAuth, jsonParser, (request, response, next)=> {
    if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));

  return new Game({
    ...request.body,
    account: request.account._id,
  }).save()
    .then(game => response.json(game))
    .catch(next);
});

gameRouter.get('/gamess/:id', bearerAuth, (request, response, next) => {
    if(!request.account)
      return next(new httpErrors(404, '__ERROR__ not found'));
  
    return Game.findById(request.params.id)
      .then(game => {
        if(!game)
          throw new httpErrors(404, '__ERROR__ not found');
  
        return response.json(game);
      })
      .catch(next);
});