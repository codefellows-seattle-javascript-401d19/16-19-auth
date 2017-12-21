![cf](https://i.imgur.com/7v5ASc8.png) Lab 17: Authentication
======

* The goal of this exercise is building RESTful HTTP server that uses basic authorization and login using bearer auth.

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


## Models
`Account` model that keeps track of a username, email, hashed password, date when it was created and token seed. Where following properties; email, username and password are requested. The model should be able to regenorate tokens using json web token. 

`Hero` model has following properties: name, sidekick, superpower, catchphrase and account that is referenced to account model. Server will assign id to each hero created. 

## Server Endpoints

* Use **POST** `/signup`

  * Creating new account. Sending account user token for further requests.

  * **200** status code will be returned as well as the access token if no errors.

  * **400** status code will be returned if username, email and password is left out

  * **409** status code will be returned marking conflict in request if object with same username property is send.

* Use **GET** `/login`

  * Already signed up user will provide username and password to receive new token for any further requests.

  * **200** status code will be returned as well as the access token if `username` and `password`  is corect and provided.

  * **400** status code will be returned if `username` or `password` is not provided.

  * **401** status code will be returned if `password` is invalid.

* Use **POST** `/heroes`

  * Existing user is able to create `hero` object. In modules above hero properties are listed. None of the properties are requeried. Using bearer authorization token is passed between account user and server.

  * **200** status code will be returned as well as `new HERO` if no errors.

  * **400** status code will be returned if invalid request has been made. Properties have to be String values.

  * **401** status code will be returned if invalid token is sent with the request.

* Use **GET** `/heroes/:id`

  * Already signed up user is able to find heroes by the unique id that hero object has. Hero's id is included in request URL and access token is sent with the headers in the authorization section. Using bearer auth.

  * **200** status code will be returned as well as `HERO<id>` if no errors.

  * **400** status code will be returned if invalid `id`is provided.

  * **401** status code will be returned if invalid token is sent with the request.

### Licence
MIT © Pedja Josifovic
