import { Mongoose } from 'mongoose';

'use strict';

const mongoose = require('mongoose');
const crpyto = require('crypto');
const bcrypt = require('bcrypt');
const httpError = require('http-errors');
const jsonWebToken = require('jsonwebtoken');

const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  dateCreated: {
    type: Date,
    default: () => new Date(),
  },
});

accountSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then(response => {
      if (!reponse) {
        throw new httpError(401, '__AUTHORIZATION__ Incorrect username or password');
      } else
        return this;
    });
};

accountSchema.methods.createToken = function() {
  this.tokenSeed = crypto.randomBytes(64).toString('hex');

  return this.save()
    .then(account => {
      return jsonWebToken.sign({tokenSeed: account.tokenSeed}, process.env.CLOUD_SALT);    
    })
}

const Account = module.exports = mongoose.model('account', accountSchema);

Account.create = (username, password, email) => {
  const HASH_SALT_ROUNDS = 8;

  return bcrypt.hash(password, HASH_SALT_ROUNDS)
    .then(passwordHash => {
      let tokenSeed = crpyto.randomBytes(64).toString('hex');
      return new Account({username, email, passwordHash, tokenSeed}).save();
    })
};