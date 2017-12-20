'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Profile = require('../model/profile');
const httpErrors = require('http-errors');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const profileRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  if(!request.body.username || !request.body.email || !request.body.password)
    return next(new httpErrors(400, `__ERROR__ username, password and email are all required to creat an account`));

  Account.create(request.body.username, request.body.email, request.body.password)
    .then(user => user.createToken())
    .then(token => response.json({token}))
    .catch(next);
});

authRouter.get('/login', basicAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ Not Found'));

  return request.account.createToken()
    .then(token => response.json({token}))
    .catch(next);
});