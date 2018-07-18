'use strict';

const faker = require('faker');
const awsMock = require('aws-sdk-mock');

process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.CLOUD_SALT = 'the_beard';

process.env.AWS_BUCKET = '<path name>';
process.env.AWS_ACCESS_KEY_ID = 'null';
process.env.AWS_SECRET_ACCESS_KEY = 'null';

awsMock.mock('S3', 'upload', (params, callback) => {
  if (!params.Key || !params.Bucket || !params.Body || ! params.ACL) {
    return callback(new Error('__ERROR__', 'key, bucket, body, and ACL required'));
  }
  if (params.ACL !== 'public-read') {
    return callback(new Error('__ERROR__', 'ACL should be public-read'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('__ERROR__', 'wrong bucket'));
  }

  callback(null, {Location: faker.internet.url()});
});

awsMock.mock('S3', 'deleteObject', (params, callback) => {
  if (!params.Key || !params.Bucket) {
    return callback(new Error('__ERROR__', 'key and bucket required'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('__ERROR__', 'wrong bucket'));
  }

  callback(null, {});
});