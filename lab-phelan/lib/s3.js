'use strict';

const fs = require('fs-extra');
const aws = require('aws-sdk');
const amazonS3 = new aws.S3();

const s3 = module.exports = {};

s3.upload = (path, key) => {
  let uploadOptions = {
    Bucket : process.env.AWS_BUCKET,
    Key : key,
    ACL : 'public-read',
    Body : fs.createReadStream(path),
  };
  return amazonS3.upload(uploadOptions)
    .promise()
    .then(response => {
      return fs.remove(path)
        .then(() => response.Location);
    })
    .catch(error => {
      return fs.remove(path)
        .then(() => Promise.reject(error));
    });
};

s3.getObject = id => {
  console.log('hit s3.getObject');
  let getOptions = {
    Bucket : process.env.AWS_BUCKET,
    Key : id,
  };
  return amazonS3.getObject(getOptions)
    .promise()
    .then(response => {
      let buffer = response;
      console.log(`as3.getObject Success: responses' keys: ${Object.keys(buffer)}`);
      return response;
    })
    .catch(error => Promise.reject(error));
};

s3.remove = key => {
  let removeOptions = {
    Key : key,
    Bucket : process.env.AWS_BUCKET,
  };
  return amazonS3.deleteObject(removeOptions)
    .promise()
    .then(response => response)
    .catch(error => Promise.reject(error));
};
