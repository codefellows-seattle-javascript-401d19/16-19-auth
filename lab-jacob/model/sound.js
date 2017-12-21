'use strict';

const mongoose = require('mongoose');

const soundSchema = mongoose.Schema({
  title : { type : String, requireed : true},
  url : {type : String, required : true},
  createdOn : {type : Date, default : () => new Date()},

  account : {
    type : mongoose.Schema.Types
  }
})