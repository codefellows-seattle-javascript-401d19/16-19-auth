'use strict';

const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
  //Mongo automatically inserts an <_id> field here.
  publicName : {type : String},
  prodName : {type : String},
  description : {type : String},
  photo : {type : String},

  accountId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    unique : true,
  },
});

module.exports = mongoose.model('car',carSchema);
