# Code Fellows 401 Lab 17
The purpose of this lab is to implement user authorization.  A POST request to '/signup' with a unique username, email and password returns a token.  The token will be used in future labs to authorize subsequent requests from that user.

The data will be stored on a MongoDB database.  Mongoose is used to interface between the server and Mongo.

## Code Style
Standard Javascript with ES6.

## Features
Users send a POST request to '/signup' with a username, email, and password.  If successful, the server responds with a token.

## Running the Server
To run the server, download the repo.  Install dependencies via ```npm install```.  Create a folder called '.env' in the root directory of this project and enter ```PORT=<yourport>``` on the first line.  3000 is a typical choice.  Also in the .env, set MONGODB_URI=mongodb:<database location>.  '://localhost/testing' is typical.  
.env example:

    PORT=3000
    MONGODB_URI=mongodb://localhost/testing


Then, in a terminal window at the location of this project, ```npm run dbon```.
Then, in a second terminal window at the location of this project ```npm run start```.

## Endpoints

### POST ('/signup')
Sent with a body of username, email, and password.
username: required and must be unique to any other usernames on the database.
email: required and must be unique to any other emails on the database.
password: required.
* Returns status 200 and a token if successful.
* Returns status 400 if all three arguments are not supplied.
* Returns status 409 if the username or email are not unique.
