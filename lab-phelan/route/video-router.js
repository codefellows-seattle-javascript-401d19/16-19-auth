'use strict';




const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Video = require('../model/video');



const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');


const videoRouter = module.exports = new Router();

videoRouter.post('/videos',bearerAuthMiddleware,upload.any(),(request,response,next) => {
  console.log('HIT VR /videos Route');
  if (!request.account)
    return next(new httpErrors(404,'_ERROR_ not found'));

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'video')
    return next(new httpErrors(400,'_ERROR_ invalid request'));

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;
  // bumper

  console.log(`VR /videos : files ${JSON.stringify(request.files)}`);
  console.log(`VR /videos : file ${file}`);
  console.log(`VR /videos : file.path ${file.path}`);
  console.log(`VR /videos : key ${key}`);

  return s3.upload(file.path,key)
    .then(url => {
      //console.log('VR S3 Upload complete.');
      return new Video({
        title : request.body.title,
        account : request.account._id,
        url,
      }).save();
    })
    .then(video => response.json(video))
    .catch(next);
});

videoRouter.get('/videos/:id');

videoRouter.delete('/videos/:id');
