'use strict';

const httpErrors = require('http-errors');
const Account = require('../model/account');

module.exports = (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new httpErrors(400, '__ERROR__ authorization header required'));
  }

  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];

  if (!base64AuthHeader) {
    return next(new httpErrors(400, '__ERROR__ basic authorization required'));
  }

  const stringAuthHeader = new Buffer(base64AuthHeader, 'base64').toString();
  const [username, password] = stringAuthHeader.split(':');

  if (!username || !password) {
    return next(new httpErrors(400, '__ERROR__ username and password required'));
  }

  return Account.findOne({username})
    .then(account => {
      if (!account) {
        throw new httpErrors(404, '__ERROR__ not found');
      }

      return account.verifyPassword(password);
    })
    .then(account => {
      request.account = account;
      return next();
    })
    .catch(next);
};
