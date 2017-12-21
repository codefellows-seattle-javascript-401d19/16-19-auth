'use strict';

const fsx = require('fs-extra');
const aws = require('aws-sdk');
const amazonS3 = new aws.S3();

const s3 = module.exports = {};

s3.upload = (path, key) => {
  let uploadOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
    ACL: 'public-read',
    Body: fsx.createReadStream(path),
  };
  return amazonS3.upload(uploadOptions)
    .promise()
    .then(response => {
      return fsx.remove(path)
        .then(() => response.Location);
    })
    .catch(error => {
      return fsx.remove(path)
        .then(() => Promise.reject(error));
    });
};

s3.remove = key => {
  let removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };
  return amazonS3.deleteObject(removeOptions).promise();
};