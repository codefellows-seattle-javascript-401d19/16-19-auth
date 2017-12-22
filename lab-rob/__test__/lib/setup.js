'use strict';

const faker = require('faker');
const awsMock = require('aws-sdk-mock');

process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.SALT_SECRET = 'schmoopschmoopschmoop';

process.env.AWS_BUCKET = 'scwooby dobob';
process.env.AWS_ACCESS_KEY_ID = 'garbagestuff oh yeah';
process.env.AWS_SECRET_ACCESS_KEY = 'stink oh stink';

awsMock.mock('S3', 'upload', (params, callback) => {
  if(!params.Key || !params.Bucket || !params.Body || !params.ACL)
    return callback(new Error('__ERROR__', 'key, bucket, body, and ACL required'));

  if(params.ACL !== 'public-read')
    return callback(new Error('__ERROR__', 'ACL should be public-read'));

  if(params.Bucket !== process.env.AWS_BUCKET)
    return callback(new Error('__ERROR__', 'wrong bucket'));

  callback(null, {Location: faker.image.imageUrl()});
});

awsMock.mock('S3', 'deleteObject', (params, callback) => {
  if(!params.Key || !params.Bucket)
    return callback(new Error('__ERROR__', 'key and bucket required'));
  
  if(params.Bucket !== process.env.AWS_BUCKET)
    return callback(new Error('__ERROR__', 'wrong bucket'));

  callback(null, {});
});