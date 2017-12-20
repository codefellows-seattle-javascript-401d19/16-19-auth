'use strict';

const httpErrors = require('http-errors');
const Account = require('../mode/account');

module.exports = (request, response, next) => {
  if(!request.headers.authorization)
    return next(new httpErrors(400, '__ERROR__ authorization header required'));
  
};
