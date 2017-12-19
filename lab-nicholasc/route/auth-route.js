'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Account = require('../model/account');
const httpErrors = require('http-errors');

const authRouter = moduule.exports = new Router();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  if(!request.body.username || !request.body.email || !request.body.password)
    return next(httpErrors(400, '__ERROR__ username, email, and password are required to create an account'));
  Account.create(request.body.username, request.body.email, request.body.password)
    .then(user => user.createToken())
    .then(token => response.json({token}))
    .catch(next);
});
