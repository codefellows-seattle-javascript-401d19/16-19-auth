'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Car = require('../model/car');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const carRouter = module.exports = new Router();

carRouter.post('/cars',bearerAuthMiddleware,jsonParser,
  (request,response,next) => {
    // 200 if successful
    // 400 if details not included (?)
    // 401 if account not found
    if(!request.account)
      return next(new httpErrors(404,'__ERROR__ not found'));

    return new Car({
      ...request.body,
      accountId : request.account._id,
    }).save()
    .then(car => response.json(car))
    .catch(next);
});

carRouter.get('/cars:id',bearerAuthMiddleware,jsonParser,(request,response,next) => {
  // 200 if successful
  // 400 if account details not included (?)
  // 401 if account not found
  // 404 if specified id does not return from db
  if (!request.params.id) return next(new httpErrors(404,'__ERROR__ not found'));

  Car.findOne({'_id':request.params.id})
  .then(car => {
    console.log(`GET cars/:id car: ${JSON.stringify(car)}`);
    response.json(car);
  })
  .catch(next)
});
