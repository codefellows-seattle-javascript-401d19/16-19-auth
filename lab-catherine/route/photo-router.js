'use strict';

// --------------------------------------
// ROUTER
// --------------------------------------
const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Photo = require('../model/photo');

// --------------------------------------
// UPLOAD
// --------------------------------------
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');
// --------------------------------------


const photoRouter = module.exports = new Router();

photoRouter.post('/photos', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '__ERROR__ Not Found'));
  if(!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'photo')
    return next(new httpErrors(400, '__ERROR__ Invalid Request')); // this error could be better

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;  // will give it the hash name + the original name (multer is giving us these)

  return s3.upload(file.path, key)
    .then(url => {
      return new Photo({
        title: request.body.title,
        account: request.account._id, // the bearerauthmiddleware is giving us the account and the upload is giving us the files
        url,
      }).save();
    })
    .then(photo => response.json(photo))
    .catch(next);
});