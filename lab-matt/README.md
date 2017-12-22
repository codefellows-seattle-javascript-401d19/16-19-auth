# 17: Relational-Modeling
Description: **Lab 17 of Code Fellows JavaScript 401d19** </br>
Author: **Matthew LeBlanc** </br>
Date: **12/19/17**

## Features
This lab features creating a login account for a server with a hash algorithm and a cryptic algorithm

## Tech/Framework Used
- node.js
- javascript
- mongodb
- Visual Studio Code

## Requirements
- node.js
- mongodb


## Usage
1. `cd` into the lab-matt folder
2. `npm install` the required dependency packages
3. `.env` values are automatically setup for jest testing</br>
they will be required for non-testing purposes
```
process.env.PORT = <port>;
process.env.MONGODB_URI = 'mongodb://localhost/<database_name>';
process.env.CLOUD_SALT = '<random mixture of numbers and letters>';
```
4. `npm run dbon` to initiate the mongo database
5. `npm run test` to run the jest testing

## Dependencies
2. `express`
3. `faker`
4. `http-errors`
5. `mongoose`
6. `superagent`
7. `winston`
8. `bcrypt`
9. `body-parser`
10. `jsonwebtoken`
##### <u>DEV</u>
1. `eslint`
2. `jest`

## Server Endpoints
- `POST /signup` - Create an account with a name, password, and email

## Tests
`POST /signup` => 200 status code if no issues and a token was created </br>
`POST /signup` => 400 status code if the data is incomplete </br>
`POST /signup` => 409 status code if the unique data is duplicated</br>
`GET /login` => 200 status code and a token if no issues </br>
`GET /login` => 400 status code if there was a bad request </br>
`GET /login` => 401 status code if there was a bad token </br>
`GET /login` => 404 status code if the account was not found </br>
`POST /vehicles` => 200 status code if no issues and data was returned </br>
`POST /vehicles` => 400 status code if there was an incomplete request </br>
`POST /vehicles` => 401 status code if there was a bad token </br>
`POST /vehicles` => 404 status code if there was a bad url request </br>
`GET /vehicles` => 200 status code if vehicle data based on id is returned </br>
`GET /vehicles` => 401 status code if using a bad token </br>
`GET /vehicles` => 404 status code if there is a bad vehicle id, (not found) </br>