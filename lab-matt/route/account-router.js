'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Account = require('../model/account');
const httpError = require('http-errors');
// const log = require('../lib/logger');

const authorizationRouter = module.exports = new Router();

authorizationRouter.post('/signup', jsonParser, (request, response, next) => {
  if (!request.body.username || !request.body.password || !request.body.email) {
    return next(httpError(400, '__ERROR__ Insufficient data: Requires username, password, and email'));
  }

  Account.create(request.body.username, request.body.password, request.body.email)
    .then(newUser => {
      return newUser.createToken();
    })
    .then(newToken => {
      return response.json({token: newToken});
    })
    .catch(next);
});