'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Picture = require('../model/picture');

const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');

const pictureRouter = module.exports = new Router();

pictureRouter.post('/pictures', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));

  if(!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'picture')
    return next(new httpErrors(400, '__ERROR__ invalid request'));

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;

  return s3.upload(file.path, key)
    .then(url => {
      return new Picture({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then(picture => response.json(picture))
    .catch(next);
});

pictureRouter.get('/pictures/:id', bearerAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ Not found'));

  Picture.findById(request.params.id)
    .then(picture => {
      response.json(picture);
    })
    .catch(next);
});


pictureRouter.delete('/pictures/:id', bearerAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ Not found'));

  return Picture.findByIdAndRemove(request.params.id)
    .then(picture => {
      let url = picture.url.split('/');
      let key = url[url.length - 1];
      return s3.remove(key)
        .then(() => response.sendStatus(204));
    })
    .catch(next);
});
