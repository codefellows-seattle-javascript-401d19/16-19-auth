'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const httpError = require('http-errors');
const jsonWebToken = require('jsonwebtoken');

const vehicleSchema = mongoose.Schema({
  vehicleType: {
    type: String,
  },
  engineSize: {
    type: String,
    unique: true,
  },
  wheels: {
    type: Number,
    required: true,
    unique: true,
  },
  dateCreated: {
    type: Date,
    default: () => new Date(),
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('vehicle', vehicleSchema);
