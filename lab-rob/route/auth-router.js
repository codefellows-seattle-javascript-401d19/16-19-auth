'use strict';

const {Router} = require('express');
const jsonParser = require('express').json();
const Account = require('../model/account');
const httpErrors = require('http-errors');
const basicAuth = require('../lib/basic-auth-middleware');

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  if(!request.body.username || !request.body.email || !request.body.password)
    return next(new httpErrors(400, '__ERROR__ username, email & password required to sign up.'));
  
  return Account.create(request.body.username, request.body.email, request.body.password)
    .then(user => user.createToken())
    .then(token => response.json({token}))
    .catch(next);
});

authRouter.get('/login', basicAuth, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));

  return request.account.createToken()
    .then(token => response.json({token}))
    .catch(next);
});