![cf](https://i.imgur.com/7v5ASc8.png) Lab 18: Authorization
======

## Submission Instructions
* Continue from lab 17
* Submit on canvas a question and observation, how long you spent, and a link to your pull request

## Resources
* [express docs](http://expressjs.com/en/4x/api.html)
* [mongoosse guide](http://mongoosejs.com/docs/guide.html)
* [mongoosse api docs](http://mongoosejs.com/docs/api.html)

## Feature Tasks  
#### Basic Auth Middleware
Create a middleware for parsing a Basic Authentication header, it should add an Account to the request object. 

#### Bearer Auth middleware 
Create a middleware for parsing a Bear Authorization header, it should add an Account to the request object.

#### Access controled resourse 
Create a model with at least four properties that belongs to an account. The model should require an account id associated to an account.

#### Server Endpoints
* `GET /login`
  * Create a login route that uses the basic authentication middleware to log in a user.
* `POST /<resouces-name>` 
  * pass a bearer authentication token in the request to authorize the creation of the resource
  * pass data as stringifed JSON in the body of a **POST** request to create a new resource
  * on success respond with a 200 status code and an authentication token
  * on failure due to a bad request send a 400 status code
  * on failure due to bad token or lack of token respond with a 401 status code
* `GET /<resouces-name>/:id` 
  * pass a bearer authentication token in the request to authorize the creation of the resource
  * on success respond with a 200 status code and an authentication token
  * on failure due to a bad id send a 404 status code
  * on failure due to bad token or lack of token respond with a 401 status code

## Tests
* Write 200, 400, and 401 tests for `/login`
* Write 200, 400, and 401 tests for `POST /<resource-name>`
* Write 200, 404, and 401 tests for `GET /<resource-name>/:id`

## Documentation
In the README.md write documention for starting your server and makeing requests to each endpoint it provides. The documentaion should describe how the server would respond to valid and invalid requests.

## Bonus (2 Points)
Refactor the error-middleware to include JsonWebToken errors and remove the need for the extra jsonWebToken.verify catch in lecture code.