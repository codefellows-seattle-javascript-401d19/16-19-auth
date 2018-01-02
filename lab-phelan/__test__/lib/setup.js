'use strict';

const faker = require('faker');
const awsSDKMock = require('aws-sdk-mock');

// process.env.PORT = '****';
// process.env.MONGODB_URI = '*****';
// process.env.SECRET = '*****';
//
// process.env.AWS_BUCKET = `*****`;
// process.env.AWS_ACCESS_KEY_ID = '*****';
// process.env.AWS_SECRET_ACCESS_KEY = '*****';


// awsSDKMock.mock('S3','upload', (params,callback) => {
//   if (!params.Key || !params.Bucket || !params.Body || !params.ACL)
//     return callback(new Error('__ERROR__','key, bucket, body, and ACL required'));
//
//   if(params.ACL !== 'public-read')
//     return callback(new Error('__ERROR__','ACL should be public-read'));
//
//   if(params.Bucket !== process.env.AWS_BUCKET)
//     return callback(new Error('__ERROR__','wrong bucket'));
//
//
//   callback(null, {Location : faker.internet.url()});
// });
//
// awsSDKMock.mock('S3','deleteObject',(params,callback) => {
//
//   if(!params.Key || !params.Bucket)
//     return callback(new Error('__ERROR__','key and bucket required'));
//
//   if(params.Bucket !== process.env.AWS_BUCKET)
//     return callback(new Error('__ERROR__','wrong bucket'));
//
//
//   callback(null,{});
// });
