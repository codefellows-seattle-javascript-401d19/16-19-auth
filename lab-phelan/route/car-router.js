'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Car = require('../model/car');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');
const errorMiddleware = require('../lib/error-middleware');

const carRouter = module.exports = new Router();

carRouter.post('/cars',bearerAuthMiddleware,jsonParser,
  (request,response,next) => {
    if(!request.account)
      return next(new httpErrors(404,'__ERROR__ not found'));

    return new Car({
      ...request.body,
      accountId : request.account._id,
    }).save()
    .then(car => response.json(car))
    .catch(next);
});

carRouter.get('/cars/:id',bearerAuthMiddleware,errorMiddleware,jsonParser,(request,response,next) => {
  // console.log(`CR-G-cars/:id - ${request.params.id}`)
  if (!request.params.id) return next(new httpErrors(404,'__ERROR__ CR not found'));

  Car.findOne({'_id':request.params.id})
  .then(car => {
    //console.log(`CR-G-cars/:id - Successfully read target car from db:\n ${JSON.stringify(car)}`);
    response.json(car);
  })
  .catch(next)
});
