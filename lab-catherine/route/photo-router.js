'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Photo = require('../model/photo');

const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');

const photoRouter = module.exports = new Router();

photoRouter.post('/photos', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ Not Found'));
  if(!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'photo')
    return next(new httpErrors(400, '__ERROR__ Invalid Request'));

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;

  return s3.upload(file.path, key)
    .then(url => {
      return new Photo({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then(photo => response.json(photo))
    .catch(next);
});

photoRouter.get('/photos/:id', bearerAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ Not Found'));
  return Photo.findById(request.params.id)
    .then(photo => response.json(photo))
    .catch(next);
});