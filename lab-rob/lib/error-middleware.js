'use strict';

const logger = require('./logger');

module.exports = (error, request, response, next) => {
  logger.error(error);
  if(error.status) { //these errors come from the http-errors package
    logger.error(`Message: ${error.message}. Responding with a ${error.status} status.`);
    return response.sendStatus(error.status);
  }

  let message = error.message.toLowerCase();

  if(message.includes('validation failed')) {
    logger.error(`Schema validation failed. Responding with a 400 status.`);
    return response.sendStatus(400);
  }

  if(message.includes('duplicate key')) {
    logger.error(`Duplicate key found. Responding with a 409 status.`);
    return response.sendStatus(409);
  }

  if(message.includes('objectid failed')) {
    logger.error('Invalid id. Responding with a 404 status.');
    return response.sendStatus(404);
  }

  if(message.includes('unauthorized')) {
    logger.error('Unauthorized access. Responding with a 401 status.');
    return response.sendStatus(401);
  }

  logger.error('Unknown error. Responding with a 500 status.');
  logger.error(error);
  return response.sendStatus(500);
};