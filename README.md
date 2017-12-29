# Back-end Deployment

Auth in Node.js using bcrypt and JWT!

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

- Allows you to make POST requests to `http://localhost:PORTNAME/signup` and receives JWT back in response

- Allows you to make POST requests to `http://localhost:PORTNAME/profiles` to update account profile info

- Allows you to make GET requests to `http://localhost:PORTNAME/profiles/id` where `id` is the profile id to receive profile info

- Allows you to make POST requests to `http://localhost:PORTNAME/images` and receive a json in response and upload the image to Amazon

- Allows you to make GET requests to `http://localhost:PORTNAME/images/id` where `id` is the image id to receive image info

- Allows you to make DELETE requests to `http://localhost:PORTNAME/images/id` where `id` is the image to delete the image from the database and from Amazon

- Accounts store all sensitive info for a user such as passwords and usernames whereas Profiles store all user data for them to create

- Stores POST requests in MongoDB, hashes passwords using bcrypt, and encrypts JWT's via a salt and preferably sent over HTTPS

POST requests must include a username, email and password.

200 status codes are returned on success, 400 if request is bad and 409 if
unique key clashes in the database occur.

# API Example

1. `post http://localhost:PORTNAME/signup` returns a JWT on success
2. `post http://localhost:PORTNAME/signup` returns a 400 on bad requests
3. `post http://localhost:PORTNAME/signup` returns a 409 in case of unique key clashes

1. `post http://localhost:PORTNAME/profiles` returns a 200 status code on success
2. `post http://localhost:PORTNAME/profiles` returns a 400 status code on bad requests
3. `post http://localhost:PORTNAME/profiles` returns a 401 status code when tokens are invalid

1. `get http://localhost:PORTNAME/profiles` returns a json blob with user info on success
2. `get http://localhost:PORTNAME/profiles` returns a 404 status code when ids are invalid
3. `get http://localhost:PORTNAME/profiles` returns a 401 status code when tokens are invalid

1. `post http://localhost:PORTNAME/images` returns a 200 status code on success
2. `post http://localhost:PORTNAME/images` returns a 400 statuscode on bad requests
3. `post http://localhost:PORTNAME/images` returns a 401 statuscode on bad tokens

1. `get http://localhost:PORTNAME/images` returns a 200 status code on success
2. `get http://localhost:PORTNAME/images` returns a 404 statuscode on bad requests
3. `get http://localhost:PORTNAME/images` returns a 401 statuscode on bad tokens

1. `delete http://localhost:PORTNAME/images` returns a 204 status code on success
2. `delete http://localhost:PORTNAME/images` returns a 404 statuscode on bad requests
3. `delete http://localhost:PORTNAME/images` returns a 401 statuscode on bad tokens

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
