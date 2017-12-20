![cf](https://i.imgur.com/7v5ASc8.png) Lab 17: Authentication
======

* The goal of this exercise is building RESTful HTTP server that uses basic authorization using express.

## Code Style
* Javascript + ES6, Express JS, Mongodb, Mongoose


## Tech / framework used
* [npm package faker](https://www.npmjs.com/package/faker) creating random generated text.
* [npm package http-errors](https://www.npmjs.com/package/uuid) to handle HTTP request/response error.
* [npm package winston](https://www.npmjs.com/package/winston) as a logging library.
* [npm package jest](http://facebook.github.io/jest/) used for TDD
* [npm package dotenv](https://www.npmjs.com/package/dotenv) for loading env variables.
* [npm package superagent](https://www.npmjs.com/package/superagent) for testing http requests
* [npm package bcrypt](https://www.npmjs.com/package/bcrypt) used to hash passwords
* [npm package jsonwebtoken](https://www.npmjs.com/package/bcrypt) de(encrypt) tokens
* [node crypto](https://nodejs.org/api/crypto.html) generating random strings

## Installation and How To Use

  * Fork || clone this repo to you computer.

  * Run `npm install`

  * Create .env file and add `PORT=<port>` and `MONGODB_URI=mongodb://localhost/testing`.

  * Run tests using `npm test`


## Model
`Account` model that keeps track of a username, email, hashed password, date when it was created and token seed. Where following properties; email, username and password are requested. The model should be able to regenorate tokens using json web token. 

## Server Endpoints

* Use **POST** `/api/signup/`

  * sends data as a stringified JSON object that has following properties: `username`, `password`, `email`, `created`.

  * if `username`, `email` and `password`  is left out, 400 status code will be returned.

  * if object with same `username` property is send, 409 status code will be returned marking conflict in request.

## Licence
MIT © Pedja Josifovic
