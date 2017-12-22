'use strict';

//_____________________ Router __________________
const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Image = require('../model/image');

//_____________________ Upload __________________
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');

const imageRouter = module.exports = new Router();

imageRouter.post('/images', bearerAuthMiddleware, upload.any(), (request, response, next) => {
  if(!request.account)
    return next(new httpErrors(404, '_ERROR_ not found'));

  if(!request.body.title || !request.files.length > 1 || request.files[0].fieldname !== 'image')
    return next(new httpErrors(400, '_ERROR_ invalid request'));
  
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

// //TODO: ADD IMAGE GET ROUTE
// GET / <resouces-name>/:id
// pass a bearer authentication token in the request to authorize the creation of the resource
// on success respond with a 200 status code and an authentication token
// on failure due to a bad id send a 404 status code
// on failure due to bad token or lack of token respond with a 401 status code


//TODO: ADD IMAGE DELETE ROUTE
// DELETE / <resouces-name>/:id
// pass a bearer authentication token in the request to authorize the creation of the resource
// on success respond with a 204 status code and an authentication token
// on failure due to a bad id send a 404 status code
// on failure due to bad token or lack of token respond with a 401 status code