'use strict';

const faker = require('faker');

require('dotenv').config();

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.CAT_CLOUD_SECRET='nicholas';
//


//------------------------------------------------------------------
//Optional awsSDKMOCK setup
//------------------------------------------------------
// const awsSDKMock = require('aws-sdk-mock');
//
// awsSDKMock.mock('S3', 'upload', (params, callback) => {
//   if(!params.Key || !params.Bucket || !params.Body || !params.ACL)
//     return callback(new Error('__ERROR__', 'must have a key, bucket, body and ACL'));
//
//   if(params.ACL !== 'public-read')
//     return callback(new Error('__ERROR__', 'ACL should be public-read'));
//
//   if(params.Bucket !== process.env.AWS_BUCKET)
//     return callback(new Error('__ERROR__', 'wrong bucket'));
//
//   callback(null, {Location : faker.internet.url()});
// });
//
// awsSDKMock.mock('S3', 'deleteObject', (params, callback) => {
//   if(!params.Key || !params.Bucket)
//     return callback(new Error('__ERROR__', 'must have a key and bucket'));
//
//   if(params.Bucket !== process.env.AWS_BUCKET)
//     return callback(new Error('__ERROR__', 'wrong bucket'));
//
//   callback(null, {});
// });
