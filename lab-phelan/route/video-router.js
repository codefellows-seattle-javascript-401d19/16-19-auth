'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Video = require('../model/video');
const jsonParser = require('body-parser').json();

const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');

const videoRouter = module.exports = new Router();

videoRouter.post('/videos',bearerAuthMiddleware,upload.any(),(request,response,next) => {
  if (!request.account)
    return next(new httpErrors(404,'_ERROR_ not found'));

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'video')
    return next(new httpErrors(400,'_ERROR_ invalid request'));

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;

  return s3.upload(file.path,key)
    .then(url => {
      return new Video({
        title : request.body.title,
        account : request.account._id,
        url,
      }).save();
    })
    .then(video => {
      let responseInfo = {};
      responseInfo.title = video.title;
      responseInfo.account = video.account;
      responseInfo.url = video.url;
      responseInfo._id = video._id;
      responseInfo.createdOn = video.createdOn;
      responseInfo.s3FileName = key;
      response.json(responseInfo);
    })
    .catch(next);
});

videoRouter.get('/videos/:id', bearerAuthMiddleware, (request,response,next) => {
  s3.getObject(request.params.id)
    .then(video => {
      response.json(video);
    })
    .catch(next);
});

videoRouter.delete('/videos/:id', bearerAuthMiddleware, (request,response,next) => {
  s3.deleteObject(request.params.id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch(next);
});
