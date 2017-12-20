'use strict';

const logger = require('./logger');

module.exports = (request, response, next) => {
  logger.info(`Handling a ${request.method} request at endpoint ${request.url}.`);
  return next();
};