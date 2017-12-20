'use strict';

const httpErrors = require('http-errors');
const Account = require('../mode/account');

module.exports = (request, response, next) => {
  if(!request.headers.authorization)
    return next(new httpErrors(400, '__ERROR__ authorization header required'));
  let base64AuthHeader = request.headers.authorization.split('Basic ')[1];

  if(!base64AuthHeader)
    return next(new httpErrors(400, '__ERROR__ basic authorization required'));

  let stringAuthHeader = new Buffer(base64AuthHeader, 'base64').toString();

  let [username,password]= stringAuthHeader.split(':');

  if(!username ||!password)
    return next(new httpErrors(400, '__ERROR__ username and password required'));

  Account.findOne({username})
    .then(account => {
      if(!account)
        return next(new httpErrors(404, '__ERROR__ not found')); //TODO: delete this- all sites have different standards from this and maybe you dont want to give too specific information here so that dirty hackers cant get in
    });
};
