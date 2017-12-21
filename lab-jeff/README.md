# Code Fellows 401 Lab 17
The purpose of this lab is to implement user authorization.  There are two models: account and profile.  

'Account' allows a user to sign up with a username, email and password.  Upon doing so, they receive a token.  Subsequently logging in with a valid username and password also returns a token.

'Profile' allows a user with a valid token to post a profile to their account, which includes a bio, first name, and last name.  The server assigns a profile id.  Get requests to a specific profile id with a valid token returns the bio, first name, and last name for that profile.

The data is stored on a MongoDB database.  Mongoose is used to interface between the server and Mongo.

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
- Purpose: A new user signs up.  This creates an account.  The user receives a token to make future requests.  
Sent with a body of username, email, and password.
username: required and must be unique to any other usernames on the database.
email: required and must be unique to any other emails on the database.
password: required.

* Returns status 200 and a token if successful.
* Returns status 400 if all three arguments are not supplied.
* Returns status 409 if the username or email are not unique.

### GET ('/login')
- Purpose:  An existing user provides username and password to receive a new token for making future requests.  
Sent with a header with the following: ```Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l``` where 'QWxhZGRpbjpPcGVuU2VzYW1l' is 'username:password' in base 64.

* Returns status 200 and a token if successful.
* Returns status 400 if the request headers do not correctly contain the username and password in the correct format.
* Returns status 401 if the password is not correct.

### POST ('/profiles')
- Purpose: A user with a valid account and token posts a bio, avatar, first name and last night to create a profile.  
Sent with a header with the following: ```Authorization : Bearer cn389ncoiwuencr``` where 'cn389ncoiwuencr' is the token provided by the server at signup or login.  The body should contain a JSON object containing the following keys:
NOTE: None of the keys are required.  The user can post only those keys which they wish to have on their profile.

1. bio (string up to 100 characters long)
2. avatar (string containing a URL link to a photo)
3. firstName (string containing the user's first name)
4. lastName (string containing the user's last name)
example: ```{bio: 'I am a dog', firstName: 'Dewey', lastName: 'Kusowski'}```

* Returns status 200 and the profile if successful.
* Returns status 400 if one of the values in the JSON object does not fit one of the criteria e.g. sending an object rather than a string.
* Returns status 401 if there is no token.

### GET ('/profiles/:id')
- Purpose: A user with a valid account and token can view individual profiles on the database.  The id in the URL should be a string of the profile ID.  
Sent with a header with the following: ```Authorization : Bearer cn389ncoiwuencr``` where 'cn389ncoiwuencr' is the token provided by the server at signup or login.
* Returns status 200 and the profile if successful.
* Returns status 404 if no profile exists with the given id.
* Returns status 401 if there is no token.
