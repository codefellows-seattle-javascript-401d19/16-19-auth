'use strict';

const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger');
const app = express();

const PORT = process.env.PORT;

let isServerOn = false;
let httpServer = null;

mongoose.Promise = Promise;

app.use(require('./logger-middleware'));
app.use(require('../route/auth-router'));
app.use(require('../route/movie-router'));

app.all('*', (request, response) => {
  logger.error(`Bad endpoint with a ${request.method} request. Sending a 404 status.`);
  return response.sendStatus(404);
});

app.use(require('./error-middleware'));

const server = module.exports = {};

server.start = () => {
  return new Promise((resolve, reject) => {
    if(isServerOn) {
      logger.error('__SERVER_ERROR__ Server already running.');
      return reject(new Error('__SERVER_ERROR__ Server already running.'));
    }

    httpServer = app.listen(PORT, () => {
      isServerOn = true;
      logger.info(`Server running on port ${PORT}.`);
      return resolve();
    });
  })
    .then(() => mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true }));
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!isServerOn) {
      logger.error('__SERVER_ERROR__ Server is already off.');
      return reject(new Error('__SERVER_ERROR__ Server is already off.'));
    }

    if(!httpServer) {
      logger.error('__SERVER_ERROR__ There is no running server to close.');
      return reject(new Error('__SERVER_ERROR__ There is no running server to close.'));
    }

    httpServer.close(() => {
      isServerOn = false;
      httpServer = null;
      logger.info('Server successfully shut down.');
      return resolve();
    });
  })
    .then(() => mongoose.disconnect());
};