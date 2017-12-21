'use strict';

const {Router} = require('express');
const jsonParser = require('express').json();
const httpErrors = require('http-errors');
const Movie = require('../model/movie');
const bearerAuth = require('../lib/bearer-auth-middleware');

const movieRouter = module.exports = new Router();

movieRouter.post('/movies', bearerAuth, jsonParser, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));

  return new Movie({
    ...request.body,
    account: request.account._id,
  }).save()
    .then(movie => response.json(movie))
    .catch(next);
});

movieRouter.get('/movies/:id', bearerAuth, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));

  return Movie.findById(request.params.id)
    .then(movie => {
      if(!movie)
        throw new httpErrors(404, '__ERROR__ not found');

      return response.json(movie);
    });
});