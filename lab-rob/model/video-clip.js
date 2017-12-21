'use strict';

const mongoose = require('mongoose');

const videoClipSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  duration: Number,
  location: String,
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('videoClip', videoClipSchema);