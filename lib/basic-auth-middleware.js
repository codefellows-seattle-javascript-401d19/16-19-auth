'use strict';

const httpErrors = require('http-errors');
const Account = require('../model/account');

module.exports = (request, reponse, next) => {
  if(!request.headers.authorization)
    return next(new httpErrors(400, 'ERROR authization header required'))

  let base64AuthHeader = request.headers.authorization.split('Basic ')[1];

  if(!base64AuthHeader)
    return next(new httpErrors(400, 'ERROR basic authorization required'));

  let stringAuthHeader = new Buffer(base64AuthHeader, 'base64').toString();
  let [username,password] = stringAuthHeader.split(':');

  if (!username || !password)
    return next(new httpErrors(400, 'ERROR username and password required'));

  return Account.findOneAndRemove({username})
    .then(account => {
      if(!account)
        throw new httpErrors(404, 'ERROR not found');
    })
    .then(account => {
      request.account = account;
      return next();
    })
    .catch(next);
};