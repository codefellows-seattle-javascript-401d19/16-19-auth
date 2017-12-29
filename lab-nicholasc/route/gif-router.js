'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Gif = require('../model/gif');

const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');

const gifRouter = module.exports = new Router();

gifRouter.post('/gifs', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));
  console.log(request.body);
  if(!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'gif')
    return next(new httpErrors(400, '__ERROR__ invalid request'));
  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`; //TODO: remove this NOTE: if you dont have the originalname the filename in aws will just be a random hash with nothing descriptive

  return s3.upload(file.path, key)
    .then(url => {
      return new Gif({
        title : request.body.title,
        account : request.account._id,
        url,
      }).save();
    })
    .then(gif => {
      return response.json(gif);
    })
    .catch(next);
});

gifRouter.get('/gifs/:id', bearerAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));
  return Gif.findById(request.params.id)
    .then(foundGif => {
      if(!foundGif)
        throw new httpErrors(404, '__ERROR__ not found');
      return response.json(foundGif);
    })
    .catch(next);
});

gifRouter.delete('/gifs/:id', bearerAuthMiddleware, (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));
  return Gif.findByIdAndRemove(request.params.id)
    .then(foundGif => {
      if(!foundGif)
        throw new httpErrors(404, '__ERROR__ not found');
      let urlArray = foundGif.url.split('/');
      let key = urlArray[urlArray.length - 1];
      return s3.remove(key)
        .then(() => {
          return response.sendStatus(204);
        });
    })
    .catch(error => {
      return Gif.findByIdAndRemove(request.params.id)
        .then(() => Promise.reject(error))
        .catch(next);
    });
});
