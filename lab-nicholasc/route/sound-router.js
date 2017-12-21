'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const Sound = require('../model/sound');

const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const s3 = require('../lib/s3');

const soundRouter = module.exports = new Router();

soundRouter.post('/sounds', bearerAuthMiddleware, )
