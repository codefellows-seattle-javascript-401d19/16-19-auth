'use strict';

const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
  publicName : {type : String},
  prodName : {type : String},
  description : {type : String},
  photo : {type : String},

  account : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    unique : true,
  },
});

module.exports = mongoose.model('car',carSchema);
