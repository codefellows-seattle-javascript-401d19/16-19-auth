'use strict';

const { Router } = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Image = require('../model/image');
const logger = require('../lib/logger');

const multer = require('multer');
const upload = multer({ dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');

const imageRouter = module.exports = new Router();

imageRouter.post('/images', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new httpErrors(404, '__ERROR__ not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new httpErrors(400, '__ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3.upload(file.path, key)
    .then(url => {
      return new Image({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then(image => {
      logger.log('info', 'POST - returning a 200 status code');
      logger.log('info', image);

      return response.json(image);
    })
    .catch(next);
});

imageRouter.get('/images/:id', bearerAuthMiddleware, (request, response, next) => {
  return Image.findById(request.params.id)
    .then(image => {
      if (!image) {
        console.log(image);
        throw httpErrors(404, 'not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', image);

      return response.json(image);
    })
    .catch(next);
});

imageRouter.delete('/images/:id', bearerAuthMiddleware, (request, response, next) => {
  console.log(request.params.id);
  return Image.findByIdAndRemove(request.params.id)
    .then(deletedImage => {
      logger.log('info', 'DELETE - returning a 204 status code');
      logger.log('info', deletedImage);
      return response.sendStatus(204);
    })
    .catch(next);
});
