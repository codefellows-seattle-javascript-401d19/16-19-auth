# REST API using MongoDB deployed wth Github, Travis CI, and Heroku

This is a simple HTTP server which follows REST constraints, that allows users to create an account, login, and update their profile and upload an image associated with their account.

## Routes Explanation

### URL: /signup

#### POST: 
  - If valid **username, email, and password** are given:
    - Server response:
      - Stores account in mongoDB
      - creates a token the user can use for future requests while signed in
  - If the **_information_** is incorrect or not present:
    - Server response: _400 error_ stating the username, email and password are required.

### URL: /login
#### GET: 
  - If **the account exist**:
    - Server response: token for the user to use on future requests
  - If **no account exists**:
    - Server response: 404 Error not found.

### URL: /profiles

#### POST: 
  - If valid **username, email, and password** are given:
    - Server response:
      - Stores account in mongoDB
      - creates a token the user can use for future requests while signed in
  - If the **_information_** is incorrect or not present:
    - Server response: _400 error_ stating the username, email and password are required.

### URL: /profiles/id
#### GET: 
  - If **the account exist**:
    - Server response: token for the user to use on future requests
  - If **no account exists**:
    - Server response: 404 Error not found.

### URL /images
#### POST:
  - If valid **account and valid image title and filepath** based on Bearer Authorization:
    - Server response:
      - uploads image to AWS via S3
      - Stores new Image in mongoDB tied to account id with image AWS url as a property
  - If no **account**:
    - Server response: _404 Error_ not found.
  - If improper or no **title or filepath**:
    - Server response: _400 Error_ invalid request.

### URL: images/id
#### GET: 
  - If **the account exist, bearer Auth passes and image id exists**:
    - Server response: json of Image object from mongoDB
  - If **no account exists**:
    - Server response: 404 Error not found.
  - If **image does not exsit**:
    - Server response: 404 Image not found.

#### DELETE: 
  - If a valid **id** is given:
    - Server response: deletes object from mongoDB, then removes from AWS S3, sends response of 204 status
- If invalid o or no **id** is given:
    - Server response: _404 error_ Not Found



## Build status

<!-- Build status of continus integration i.e. travis, appveyor etc. Ex.  -->
Status: Working


## Code style

js-standard-style

## Tech/framework used
- Eslint
- Node
- jest
- superagent
- dotenv
- Winston
- Faker
- Javascript /ES6
- express
- http-errors
- mongoose
- mongodb


#### Built with

VScode

## Features

- It uses Winston Logger to keep track of logs.
- GET, POST, PUT, DELETE routes for newly discovered exo-planets and hoststars
- Uses Faker to fake information for testing purposes

## Code Example

### Routes Example
```

imageRouter.delete('/images/:id', bearerAuthMiddleware, (request, response, next) => {

  return Image.findByIdAndRemove(request.params.id)
    .then(image => {
      if (!image)
        throw new httpErrors(404, '__ERROR__ not found');

      let urlArray = image.url.split('/');
      let key = urlArray[urlArray.length - 1];
      return s3.remove(key);
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(next);
});
```

## Installation
1. ) Get source code from github 
2. ) In terminal navigate to 'lab-seth' folder and run following commands:
```
npm i
```

## API Reference

Docs in Progress

## Tests

- Confirms a 200 status code on a proper POST request
- Confirms a 400 status code when an improper POST request is made

- Confirms a 200 status code on a proper GET request
- Confirms a 400 status code when an improper GET request is made

- Confirms a 200 status code on a proper PUT request
- Confirms a 400 status code when an improper PUT request is made

- Confirms a 200 status code on a proper DELETE request
- Confirms a 400 status code when an improper DELETE request is made

#### To Run Tests, run these commands in terminal from lab-seth folder

- npm run dbon
- npm run test


## Credits

- Winston
- Node
- dotenv
- Faker
- suepragent
- jest
- uuid
- Classmates that helped me!

## License

#### MIT © Seth Donohue