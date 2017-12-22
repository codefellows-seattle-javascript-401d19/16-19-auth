'use strict';

// ========================= ROUTER =========================
const {Router} = require('express');
const httpError = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Image = require('../model/image');

// ========================= UPLOAD =========================
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');


const imageRouter = module.exports = new Router();

imageRouter.post('/images', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new httpError(404, '__ERROR__ not found'));
  }
  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new httpError(400, '__ERROR__ invalid request'));
  }

  let file = request.files[0];
  let key = `${file.fieldname}.${file.originalname}`;
  console.log('he\nll\no', file.path);
  
  return s3.upload(file.path, key)
    .then(url => {
      return new Image({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then(savedImage => {
      return response.json(savedImage);
    })
    .catch(next);
});