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
    default: () => {
      return new Date();
    },
  },
  account: {
    type: mongoose.Schema.Types.objectId,
    required: true,
  },
});

module.exports = mongoose.model('image', imageSchema);
