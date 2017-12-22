'use strict';

//----------------------------------------------------
// ROUTER
//----------------------------------------------------
const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Image = require('../model/image');
//----------------------------------------------------
// UPLOAD
//----------------------------------------------------
const multer = require('multer');
const upload = multer({dest : `${__dirname}/../temp`});
const s3 = require('../lib/s3');


const imageRouter = module.exports = new Router();

imageRouter.post('/images', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));
  
  if(!request.body.title || !request.files.lenght > 1 || request.files[0].fieldname !== 'image')
    return next(new httpErrors(400, '__ERROR__ invalid request'));
  
  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;

  return s3.upload(file.path, key)
    .then(url => {
      return new Image({
        title : request.body.title,
        account : request.account._id,
        url,
      }).save();
    })
    .then(image => response.json(image))
    .catch(next);
});

imageRouter.get('/images/:id', bearerAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));

  Image.findById(request.params.id)
    .then(image => {
      response.json(image);
    })
    .catch(next);
});

imageRouter.delete('/images/:id', bearerAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));

  Image.findById(request.params.id)
    .then(image => {
      return s3.remove(image.url)
        .then(() => response.sendStatus(204));        
    })
    .catch(next);
});