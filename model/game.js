'use strict';

const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  title: String,
  type: String,
  year: Number,
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('game', gameSchema);