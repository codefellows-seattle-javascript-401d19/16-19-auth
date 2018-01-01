'use strict';




const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Sound = require('../model/sound');



const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');


const soundRouter = module.exports = new Router();

soundRouter.post('/sounds',bearerAuthMiddleware,upload.any(),(request,response,next) => {
  console.log('HIT SR /sounds Route');
  if (!request.account)
    return next(new httpErrors(404,'_ERROR_ not found'));

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'video')
    return next(new httpErrors(400,'_ERROR_ invalid request'));

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;
  // bumper

  console.log(`SR /sounds : files ${JSON.stringify(request.files)}`);
  console.log(`SR /sounds : file ${file}`);
  console.log(`SR /sounds : file.path ${file.path}`);
  console.log(`SR /sounds : key ${key}`);

  return s3.upload(file.path,key)
    .then(url => {
      //console.log('SR S3 Upload complete.');
      return new Sound({
        title : request.body.title,
        account : request.account._id,
        url,
      }).save();
    })
    .then(sound => response.json(sound))
    .catch(next);
});
