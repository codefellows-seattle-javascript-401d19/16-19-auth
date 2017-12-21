# Code Fellows: Code 401d19: Full-Stack JavaScript

## Lab 17-19: Auth

The purpose of this lab is to establish a RESTful API that authenticates users and authorizes them for various actions. User passwords are stored in the database using a hash, and unique tokens/token seeds are used for authentication.

## Tech/frameworks/packages

- node 
- npm
- node packages
  - jest
  - eslint 
  - superagent
  - express
  - mongoose
  - dotenv
  - faker
  - winston
  - mongoose
  - http-errors
  - bcrypt
  - crypto
  - jsonwebtoken
- mongodb

## How to use?
Clone this repo, `cd` into `lab-rob`, run `npm install`. 

Touch `.env` in `lab-rob` and add `PORT=<you-desired-port>` and `MONGODB_URI=mongodb://localhost/<desired database name>`, and `SALT_SECRET=<your secret code>`.

Run `npm start` to start the server.

Make sure you have MongoDb installed (`brew install mongo`), and then run `npm run dbon` to start the database.

Make POST/GET requests to the server to interact with the database, try using httpie (`brew install httpie`).

When finished, run `npm run dboff` to terminate the database.

## Routes

#### `POST /signup`

Send a JSON object with the properties `username` (String, required, unique), `password` (String, required), `email` (String, required, unique).

Throws a 400 error if any of the required properties are missing.

Creates a new user in the database and returns their access token.

#### `GET /login`

Set Auth header with Basic authorization `username:password` in base 64. If username and password match, a login token is returned.

Sends a 401 if access is not authorized.

Sends a 404 if account with username is not found.

#### `POST /movies`

Set Bearer auth with token and send a JSON object with `title` (String), `lead` (String), `year` (Number), `synopsis` (String), `account` (account id).

Sends a 400 if any piece of the schema is missing, or if auth is missing or invalid.

Sends a 401 if request is invalid.

Sends a 404 if the token doesn't match any users's token.

#### `GET /movies/<movie id>

Set Bearer auth with token and get the requested movie.

404 is sent if id is not in database.

401 is sent if request is unauthorized.

## Modules

### `error-middleware.js`

Exports a single function of arity four. Takes in `error`, `request`, `response`, and `next`. This function handles all error logging and status messages, and should be required into an `app.use` call after the catch all route in `server.js`.

### `logger-middleware.js`

Exports a single function of arity three. Takes in `request`, `response`, and `next`. This function handles all information logging, and should be required into an `app.use` call before hitting the routes `app.use` call.

### `logger.js`

Exports an instance of a Winston logger that should be used for all info and error logging.

### `server.js`

Exports an object with two methods, `start()` and `stop`. Both have an arity of zero and return promises.

### `account.js`

Exports a mongoose model for an account. Schema is as follows:

    `username: String` (required, unique)
    `email: String` (required, unique)
    `password: String` (required)

### `movie.js`

Exports a mongoose model for a movie. Schema is as follows:

    `title: String`
    `lead: String`
    `year: Number`
    `synopsis: String`
    `account: ObjectId`

### `auth-router.js`

Exports an instance of a new `Express` Router object specifying a POST for account creation and a GET for logging in. 

Is required into server.js `app.use`.

### `movie-router.js`

Exports an instance of a new `Express` Router object specifying a POST for movie creation and a GET for movie getting. 

Is required into server.js `app.use`.


### `index.js`

When executed, starts the server.

### account-mock-factory.js

Exports an object with two methods.

1. `accountMock.create()` has an arity of zero and adds a mock account to the database. Returns an object with the mock account and token.
1. `accountMock.remove()` has an arity of zero and removes all accounts from the database.

### movie-mock-factory.js

Exports an object with two methods.

1. `movieMock.create()` has an arity of zero and adds a mock movie to the database as well as a mock account. Returns an object with the mock account and token, and mock movie.
1. `accountMock.remove()` has an arity of zero and removes all accounts and movies from the database.

### basic-auth-middleware.js

exports a middleware function of arity three that processes requests and checks for proper basic authentication. Adds an account to the request if the username and password are correct, otherwise throws an error.

### bearer-auth-middleware.js

exports a middleware function of arity three that processes requests and checks for proper bearer authentication. Adds an account to the request if the token is correct, otherwise throws an error.

### setup.js

When required into the test files, environment variables are established.

## Tests

run `npm test` to check all tests. Test data saved to `testing` collection.

## Contribute

You can totally contribute to this project if you want. Fork the repo, make some cool changes and then submit a PR.

## Credits

Initial codebase created by Vinicio Vladimir Sanchez Trejo.

## License

MIT. Use it up!