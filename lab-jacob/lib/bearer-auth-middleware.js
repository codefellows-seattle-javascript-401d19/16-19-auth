'use strict';

const jsonWebToken = require('jsonwebtoken');
const httpErrors = require('http-errors');

const Account = require('../model/account');

const promisify = (fn) => (...args) => {
  return new Promise ((resolve, reject) => {
    fn(...args, (error,data) => {
      if(error)
        return reject(error);
      return resolve(data);
    });
  });
};

module.exports = (request,response,next) => {
  if(!request.headers.authorization)
    return next(new httpErrors(400, 'ERROR authorization header required'));

  const token = request.headers.authorization.split('Bearer ')[1];

  if(!token)
    return next(new httpErrors(400, 'ERROR tokenrequired'));

  return promisify(jsonWebToken.verify)(token, process.env.CAT_CLOUD_SECRET)
    .then(decryptedData => {
      console.log('====================================');
      console.log(decryptedData);
      console.log('====================================');
      return Account.findOne({tokenSeed : decryptedData.tokenSeed});
    })
    .then(account => {
      if(!account)
        throw new httpErrors(404,'ERROR not found');
      request.account = account;
      return next();
    })
    .catch(next);
};