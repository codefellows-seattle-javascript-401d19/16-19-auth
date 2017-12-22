'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuth = require('../lib/bearer-auth-middleware');
const VideoClip = require('../model/video-clip');
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');

const videoClipRouter = module.exports = new Router();

videoClipRouter.post('/video-clips', bearerAuth, upload.any(), (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));
  
  if(!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'video-clip')
    return next(new httpErrors(400, '__ERROR__ invalid request'));

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;

  return s3.upload(file.path, key)
    .then(url => {
      let videoClipData = {
        title: request.body.title,
        account: request.account._id,
        url,
        key,
      };
      
      if(request.body.duration)
        videoClipData.duration = request.body.duration;

      if(request.body.location)
        videoClipData.location = request.body.location;

      return new VideoClip(videoClipData).save();
    })
    .then(videoClip => response.json(videoClip))
    .catch(next);
});

videoClipRouter.get('/video-clips/:id', bearerAuth, (request, response, next) => {
  return VideoClip.findById(request.params.id)
    .then(videoClip => {
      if(!videoClip)
        throw new httpErrors(404, '__ERROR__ not found');

      return response.json(videoClip);
    })
    .catch(next);
});

videoClipRouter.delete('/video-clips/:id', bearerAuth, (request, response, next) => {
  return VideoClip.findByIdAndRemove(request.params.id)
    .then(videoClip => {
      if(!videoClip)
        throw new httpErrors(404, '__ERROR__ not found');

      return s3.remove(videoClip.key);
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(next);
});