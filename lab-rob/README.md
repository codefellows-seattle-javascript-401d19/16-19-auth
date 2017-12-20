# Code Fellows: Code 401d19: Full-Stack JavaScript

## Lab 13/14: Express and Mongo REST API

The purpose of this lab is to get practice building an additional Express rest server, and to practice querying Mongo using mongoose. Additionally, we will be using a two-resource scheme.

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
- mongodb

## How to use?
Clone this repo, `cd` into `lab-rob`, run `npm install`. 

Touch `.env` in `lab-rob` and add `PORT=<you-desired-port>` and `MONGODB_URI=mongodb://localhost/<desired database name>`.

Run `npm start` to start the server.

Make sure you have MongoDb installed (`brew install mongo`), and then run `npm run dbon` to start the database.

Make POST/GET/DELETE/PUT requests to the server to interact with the database, try using httpie (`brew install httpie`).

Make sure to add a show to the database before adding any episodes. See below for further instructions.

When finished, run `npm run dboff` to terminate the database.

## Routes

### Shows

#### `POST /api/shows`

Send a JSON object with the properties `title` (String, required, unique), `seasons` (Number, required), `releaseYear` (Number, optional), `ongoing` (Boolean, optional).

Throws an error if any of the required properties are missing.

Adds a new tv show to the database. Returns the added show object with `timestamp`, `_id`, and `episodes` properties.

#### `GET /api/shows?page=<page number>`

Get an array of 10 shows in the database, based off of page number. If the page is higher than the total pages, or less than 1, a 404 error is thrown.

#### `GET /api/shows/<show id>?populate=<boolean>`

Return a specific show as requested by the <show id>.

If a show with that id is not found, a 404 is returned.

Add a query string of `?populate=true` if you want the show to return episode objects instead of episode ids. If you just want episode ids there is no need to send a query string.

#### `DELETE /api/shows/<show id>`

Delete a specific show as requested by the <show id>. If successful, a 204 code is sent.

If a show has linked episodes, all linked episodes are also removed.

If a show with that id is not found, a 404 is returned.

#### `PUT /api/shows/<show id>`

Update a specific show's properties by id. You can only change the original properties listed in the POST notes above.

If successful, the new show is returned with a 200 status.

If a show with that id is not found, a 404 status is returned.

If a you change the `title` to a title that is already in the database a 409 status is thrown.


### Episodes

#### `POST /api/episodes`

Send a JSON object with the properties `name` (String, required, unique), `number` (Number, required), `duration` (Number, optional), `stars` (number, optional 0 - 5), `actors` (Array, strings, optional), `show` (ObjectID, required, unique)

Throws an error if any of the required properties are missing.

Adds a new episode to the database and establishes a connection to the specified show. Returns the added episode object with `timestamp` and `_id` properties.

#### `GET /api/episodes/<episode id>`

Return a specific episode as requested by the <episode id>.

If a episode with that id is not found, a 404 is returned.

#### `DELETE /api/episode/<episode id>`

Delete a specific episode as requested by the <episode id>. If successful, a 204 code is sent. The episode is also removed from the `episodes` array in the `show` document that it is linked to.

If a episode with that id is not found, a 404 is returned.

#### `PUT /api/episodes/<episode id>`

Update a specific episode's properties by id. You can only change the original properties listed in the POST notes above.

If successful, the new episode is returned with a 200 status.

If an episode with that id is not found, a 404 status is returned.

If a you change the `name` to a name that is already in the database a 409 status is thrown.

## Modules

### `error-middleware.js`

Exports a single function of arity four. Takes in `error`, `request`, `response`, and `next`. This function handles all error logging and status messages, and should be required into an `app.use` call after the catch all route in `server.js`.

### `logger-middleware.js`

Exports a single function of arity three. Takes in `request`, `response`, and `next`. This function handles all information logging, and should be required into an `app.use` call before hitting the routes `app.use` call.

### `logger.js`

Exports an instance of a Winston logger that should be used for all info and error logging.

### `server.js`

Exports an object with two methods, `start()` and `stop`. Both have an arity of zero and return promises.

### `show.js`

Exports a mongoose model for a show. Schema is as follows:

    `title: String` (required, unique)
    `seasons: Number` (required)
    `releaseYear: number` (optional)
    `ongoing: Boolean` (optional)
    `timestamp` (auto generated)
    `episodes` (auto generated)
    `_id` (auto generated)


### `show-router.js`

Exports an instance of a new `Express` Router object specifying routes for all show related HTTP requests. 

Should be required into server.js `app.use`.

### `episode.js`

Exports a mongoose model for an episode. Schema is as follows:

    `name: String` (required, unique)
    `number: Number` (required)
    `duration: Number` (optional, min 0, max 5)
    `actors: Array of Strings` (optional)
    `show` Show ObjectId (required)
    `timestamp` (auto generated)
    `_id` (auto generated)

### `episode-router.js`

Exports an instance of a new `Express` Router object specifying routes for all episode related HTTP requests. 

Should be required into server.js `app.use`.

### `index.js`

When executed, starts the server.

### episode-mock.js

Exports an object with three methods.

1. `episodeMock.create()` has an arity of zero and adds a mock show and episode to the database.
1. `episodeMock.createMany(number)` has an arity of one and adds a mock show and a given number of mock episodes to the database.
1. `episodeMock.remove()` has an arity of zero and removes all episodes from the database and the mock show.

### show-mock.js

Exports an object with two methods.

1. `showMock.create()` has an arity of zero and adds a mock show to the database.
1. `episodeMock.createMany(number)` has an arity of one and adds a mock show and a given number of mock episodes to the database.
1. `showMock.remove()` has an arity of zero and removes all shows from the database.

### setup.js

When required into the test files, environment variables are established.

## Tests

run `npm test` to check all tests. Test data saved to `testing` collection.

### `show-router.js`

Run tests for shows only with `npm run test-shows`

#### POST

1. should respond with a 200 status and the sent object when successful.
1. should respond with a 400 status if schema validation fails, for example a missing title.
1. should respond with a 409 status if an object with a duplicate title is sent.

#### GET

1. should respond with a 200 status and the requested object.
1. should respond with a 404 status if a show with the given id is not found.
1. should respond with an array of objects from the requested page if the requested page exists, and a 200 status.
1. should respond with a 400 status if route is hit without a query string.
1. should respond with a 400 status if query string cannot be cast as a number.
1. should respond with a 404 status if page query is < 1.
1. should respond with a 404 status if page query is > last page.

#### DELETE

1. should respond with a 204 status if show is deleted.
1. should respond with a 404 status if a show with the given id is not found.


#### PUT

1. should respond with a 200 and updated object if no errors.
1. should respond with a 409 if data validation fails, for example if you change the title to a preexisting title.
1. should respond with a 404 if a bad id is requested.
1. should respond with a 400 if no body sent.


### `episode-router.js`

Run tests for episodes only with `npm run test-episodes`

#### POST

1. should respond with a 200 status code and the sent object if no errors.
1. should respond with a 400 status if missing episode name.
1. should respond with a 400 status if missing episode number.
1. should respond with a 400 status if missing show id.
1. should respond with a 404 status if an incorrect show id is used.
1. should respond with a 409 status if an object with a duplicate episode name is sent.

#### GET

1. should respond with a 200 status code and the requested object.
1. should respond with a 404 status code if id is not in database.

#### DELETE

1. should respond with a 204 when removing an episode successfully.
1. should respond with a 204 when removing an episode successfully.

#### PUT

1. should respond with a 200 and updated object if no errors.
1. should respond with a 409 if data validation fails, for example if you change the name to a preexisting name.
1. should respond with a 404 if a bad id is requested.
1. should respond with a 400 if no body sent.

## Contribute

You can totally contribute to this project if you want. Fork the repo, make some cool changes and then submit a PR.

## Credits

Initial codebase created by Vinicio Vladimir Sanchez Trejo.

## License

MIT. Use it up!