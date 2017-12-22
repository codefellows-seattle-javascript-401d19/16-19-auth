'use strict';

const fs = require('fs-extra');
const aws = require('aws-sdk');
const amazonS3 = new aws.S3();

const s3 = module.exports = {};

s3.upload = (path, key) => {
  let uploadOptions = {
  }
};
