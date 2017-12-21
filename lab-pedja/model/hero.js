'use strict';

const mongoose = require('mongoose');

const heroSchema = mongoose.Schema({
  name : {type : String},
  sidekick : {type : String},
  superpower : {type : String},
  catchphrase : {type : String},
  
  account : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    unique : true,
  },
});

module.exports = mongoose.model('heroes', heroSchema);
