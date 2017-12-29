![cf](https://i.imgur.com/7v5ASc8.png) Lab 17: Authentication
======

* The goal of this exercise is building RESTful HTTP server that uses basic authorization and login using bearer auth. All assets of API are located on AWS S3 cloud. Three models are created `account`, `hero` and `image`. User with valid token is allowed to manipulate assets(images). User can add, delete and get specific image with passing it's id into the request route. 

## Code Style
* Javascript + ES6, Express JS, Mongodb, Mongoose, AWS S3


## Packages used
* [faker](https://www.npmjs.com/package/faker) creating random generated text.
* [http-errors](https://www.npmjs.com/package/uuid) to handle HTTP request/response error.
* [  winston](https://www.npmjs.com/package/winston) as a logging library.
* [  jest](http://facebook.github.io/jest/) used for TDD
* [  dotenv](https://www.npmjs.com/package/dotenv) for loading env variables.
* [  superagent](https://www.npmjs.com/package/superagent) for testing http requests
* [  bcrypt](https://www.npmjs.com/package/bcrypt) used to hash passwords
* [  jsonwebtoken](https://www.npmjs.com/package/bcrypt) de(encrypt) tokens
* [node crypto](https://nodejs.org/api/crypto.html) generating random strings
* [  multer](https://www.npmjs.com/package/multer) handling multipart/form data and uploading files
* [  fs-extra](https://www.npmjs.com/package/fs-extra) file system node module
* [  aws-sdk](https://www.npmjs.com/package/aws-sdk) AWS-SDK for JS 
* [  aws-sdk-mock](https://www.npmjs.com/package/aws-sdk-mock) prevent AWS services to be called while testing functionality 


## Installation and How To Use

  * Fork || clone this repo to you computer.

  * Run `npm install`

  * Create .env file and add 
    > `PORT=<port>`  
    >`MONGODB_URI=mongodb://localhost/testing`

  * Setting up AWS S3 account
    * In order to use this API, user must create AWS user account, create new Bucket on S3 and get access to **AWS_ACCESS_KEY_ID** and **AWS_SECRET_ACCESS_KEY** that will have to be stored in .env file. Never make these valiables public.

    * For testing purposes *aws-sdk-mock* is used. This way calls to aws services will be intercepted while testing for functionality - this feature is located in setup.js file. 

  * Start MongoDB `npm run dbon`

  * Run tests using `npm test`


## Models
`Account` model that keeps track of a username, email, hashed password, date when it was created and token seed. Where following properties; email, username and password are requested. The model should be able to regenorate tokens using json web token. 

`Hero` model has following properties: name, sidekick, superpower, catchphrase and account that is referenced to account model. Server will assign id to each hero created. 

`Image` model has following properties: title, url, createdOn and account that is referenced to account model. Server will assign id to each image created. Title and url property are REQUIRED.

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

* Use **POST** `/images`

  * User with valid token is able to post image and server will store it in AWS S3 cloud. In MongoDB new image object will be created. 

  * **200** status code will be returned as well as json representation of image if no errors.

  * **400** status code will be returned if invalid request has been made. 

  * **401** status code will be returned if invalid token is sent with the request.

* Use **GET** `/images/:id`

  * User with valid token is able to ACCESS specific image in our db and AWS. Passed in ID must be valid image ID.

  * **200** status code will be returned as well as json representation of image if no errors.

  * **404** status code will be returned if invalid ID has been sent. 

  * **401** status code will be returned if invalid token is sent with the request.

* Use **DELETE** `/images/:id`

  * User with valid token is able to DELETE specific image from our db and AWS. Passed in ID must be valid image ID.

  * **204** status code will be returned if no errors.

  * **404** status code will be returned if invalid ID has been sent. 

  * **401** status code will be returned if invalid token is sent with the request.

### Licence
MIT © Pedja Josifovic
