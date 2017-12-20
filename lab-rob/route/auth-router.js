'use strict';

const {Router} = require('express');
const jsonParser = require('express').json();
const Account = require('../model/account');
const httpErrors = require('http-errors');

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  if(!request.body.username || !request.body.email || !request.body.password)
    return httpErrors(400, '__ERROR__ username, email & password required to sign up.');
  
  Account.create(request.body.username, request.body.email, request.body.password)
    .then(user => user.createToken())
    .then(token => response.json({token}))
    .catch(next);
});