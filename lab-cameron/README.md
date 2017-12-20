# Basic auth

Auth in Node.js using bcrypt and JWT

# Tech Used

- Node.js
- express
- bcrypt
- body parser
- dotenv
- http-errors
- jsonwebtoken
- MongoDB
- mongoose
- winston
- faker
- jest
- superagent

# Features

- Allows you to make POST request to `http://localhost:PORTNAME/signup` and receives JWT back in response

- Stores POST requests in MongoDB, hashes passwords using bcrypt, and encrypts JWT's via a salt and preferably sent over HTTPS

POST requests must include a username, email and password.

200 status codes are returned on success, 400 if request is bad and 409 if
unique key clashes in the database occur.

# API Example

1. `post http://localhost:PORTNAME/signup` returns a JWT on success
2. `post http://localhost:PORTNAME/signup` returns a 400 on bad requests
3. `post http://localhost:PORTNAME/signup` returns a 409 in case of unique key clashes

# Installation / How to Use

1. Clone the repo
2. run `npm install`
3. If developing, Ensure that `setup.js` inside of `__test__/lib` is compatible with your machine
4. If for use in production, create a `.env` file at the root of the project and create a PORT, MONGODB_URI and SECRET (for JWT encryption) key/value pairs
5. run `npm run dbon` to startup mongo
6. index.js would be an entry point for `server.start()` to be called upon in future versions
7. Make POST requests and receive your JWT's

# Tests

All tests use faker, superagent and jest

# Credits

Cameron Moorehead - https://github.com/CameronMoorehead

# License

GPL-3.0
