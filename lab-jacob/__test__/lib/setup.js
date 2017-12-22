'use strict';

const faker = require('faker');
const awsSDKMock = require('aws-sdk-mock');

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.CAT_CLOUD_SECRET = 'yggrasil_secret';

process.env.AWS_BUCKET = 'Whatever';
process.env.AWS_ACCESS_KEY_ID = 'Secret ID';
process.env.AWS_ACCESS_KEY_AC = 'Super Secret Key';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if(!params.Key || !params.Bucket || !params.Body || !params.ACL )
    return callback(new Error('ERROR', 'key,bucket,body and ACL required'));

  if(params.ACL !== 'public-read')
    return callback(new Error('ERROR', 'ACL public read setting required'));
  
  if(params.Bucket !== process.env.AWS_BUCKET)

    return callback(new Error('ERROR', 'incorrect bucket'));

  callback(null, {Location : faker.internet.url()});
});

awsSDKMock.mock('S3', 'deleteObject', (params, callback) => {
  if(!params.Key || !params.Bucket)
    return callback(new Error('ERROR', 'key and bucket required'));

  if(params.ACL !== 'public-read')
    return callback(new Error('ERROR', 'ACL public read setting required'));

  if(params.Bucket !== process.env.AWS_BUCKET)

    return callback(new Error('ERROR', 'incorrect bucket'));
  
  callback({});
});