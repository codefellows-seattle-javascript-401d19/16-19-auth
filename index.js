'use strict';

require('dotenv').config();

let server = require('./lib/server');

server.start();

console.log(`Server is running on port ${process.env.PORT}`);