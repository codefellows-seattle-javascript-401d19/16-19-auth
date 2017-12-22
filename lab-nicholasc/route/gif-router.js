'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Sound = require('../model/gif');

const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');

const gifRouter = module.exports = new Router();

gifRouter.post('/gifs', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ not found'));
  if(!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'gif')
    return next(new httpErrors(400, '__ERROR__ invalid request'));

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`; //TODO: remove this NOTE: if you dont have the originalname the filename in aws will just be a random hash with nothing descriptive

  return s3.upload(file.path, key)
    .then(url => {
      return new Sound({
        title : request.body.title,
        account : request.account._id,
        url,
      }).save();
    })
    .then(gif => {
      console.log(gif);
      console.log(typeof gif);
      return response.json(gif);
    })
    .catch(next);
});
