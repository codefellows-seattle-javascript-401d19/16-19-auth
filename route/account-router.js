'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Account = require('../model/account');
const httpErrors = require('http-errors');
const basicAuthMiddleware = require('../lib/basic-auth-middleware');


const accountRouter = module.exports = new Router();

accountRouter.post('/signup', jsonParser, (request, response, next) => {
  if (!request.body.username || !request.body.email || !request.body.password)
    return next(httpErrors(400, '__ERROR__ username, email, and password required to create an account'));

  Account.create(request.body.username, request.body.email,
    request.body.password)
    .then(user => user.createToken())
    .then(token => response.json({token}))//ES6 object creation shorthand
    .catch(next);
});

accountRouter.get('/login', basicAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return next(httpErrors(404, '_ERROR_ not found'));

  return request.account.createToken()
    .then(token => response.json({token}))
    .catch(next);
});

//TODO: ADD ACCOUNT DELETE ROUTE
// DELETE / <resouces-name>/:id
// pass a bearer authentication token in the request to authorize the creation of the resource
// on success respond with a 204 status code and an authentication token
// on failure due to a bad id send a 404 status code
// on failure due to bad token or lack of token respond with a 401 status code