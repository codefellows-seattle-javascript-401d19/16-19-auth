'use strict';

const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  title: String,
  lead: String,
  year: Number,
  synopsis: String,
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);