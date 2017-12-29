'use strict';

const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('image', imageSchema);
