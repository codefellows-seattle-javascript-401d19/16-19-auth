'use strict';

const {Router} = require('express');
const jsonParser = require('express').json();
const Account = require('../model/account');
const httpError = require('http-errors');

const authorizationRouter = module.exports = new Router();

authorizationRouter.post('/signup', jsonParser, (request, response, next) => {
  if (!request.body.username || !request.body.password || !request.body.email) {
    return next(httpError(400, '__ERROR__ Insufficient data: Requires username, password, and email'));
  }

  Account.create(request.body.username, request.body.password, request.body.email)
    .then(newUser => {
      newUser.createToken();
    })
    .then(newToken => {
      response.json({token: newToken});
    })
    .catch(next);
});