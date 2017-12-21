'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Account = require('../model/account');
const httpErrors = require('http-errors');


const authRouter = module.exports = new Router();

authRouter.post('/signup',jsonParser,(request,response,next) => {
  if(!request.body.username || !request.body.password || !request.body.email)
    return next(httpErrors(400,''));

  Account.create(request.body.username, request.body.email, request.body.password)
    .then(user => user.createToken())
    .then(token => response.json({token}))
    .catch(next);
});
