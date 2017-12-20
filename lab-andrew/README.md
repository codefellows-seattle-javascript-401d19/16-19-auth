# Lab 17 Basic Authorization

## Overview

This API is a simple User Database API. It exists so you can create virtual users and securely store their passwords in an secure manner. It is built using express and mongo.
***
## Getting Started

To get started using this application, familiarity with node and npm, as well as git is assumed. It is also assumed that you have a current version of mongodb. Fork/clone this repo to your machine, and do an `npm install`. You will need to set up a .env file (saved in the root directory of this project) with the PORT you would like to use (i.e. PORT=3000). To this file you should also add a MONGODB_URI variable set to the path to `mongodb://localhost/testing`.

Install jest if you do not have it globally installed with `npm i jest`. In the terminal, navigate to the project folder. Open another new tab in the terminal and in that tab run the command `npm run dbon`. To run the tests, in the original terminal tab type `npm run test`.
***
## Modules

There is a function from index.js which calls the server.js start function. The model is a basic account to be stored in our MongoDB database. There is one router module for routing http requests: the account-router.js module. This has a POST route which creates a new user instance in the mongo database. The create method on the model has a hash function which scrambles a user's password in a one way manner. This scrambled password is then stored in our database. The create then calls the createToken method, which randomly generates a token seed which is stored in the database with that user. Any errors in the POST request are also thrown, to be handled in the error-middleware. All that is exported from the server.js file is server.start and server.stop. There is a logger-middleware which is required in by express in the server. All requests to the API hit this logger which logs the actions in the log files. This then passes to the actual routing functionality. If any errors occur during routing, they get passed to the error handling middleware (which is also required into express in server.js) which is parsed and handled from the modules exported from error-middleware.js. Logging is performed by the logger-middleware module, which is the first path in all routes. Tests are performed by the account-router.test module which uses the account-mock module to instantiate and imitate the real world RESTful behavior of this API.
***
## Making Requests to the API

#### Account
To make a POST request, the path will be '__server_address__/signup', e.g. if you are running the server on your own machine, the address will be something like: 'http://localhost:3000/signup'. A POST request expects a JSON object in the form of '{"username":"`<name>`","email":"`<email address>`","password":"`<the security of your account is limited by the strength of your password>`"}' and a new user will be created with a unique ID. All three fields are required, and the username and email must be unique. POST requests without a required field will be rejected with a 400 error, and requests duplicating existing names or emails will be rejected with a 409 error.

***
## Technology/Credits

Created by Andrew Bloom. This app is being logged with winston and is using superagent and jest for testing server requests. Server built with express and persistence managed by mongoose/mongodb.
