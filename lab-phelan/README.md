In the README.md write documention for starting your server and makeing requests to each endpoint it provides. The documentaion should describe how the server would respond to valid and invalid requests.

(Same as Lab 11)

--------------------------------------------------------------------------

A] Starting this server:

In order to run my Node instance in this lab...
1. Clone the gitHub repository.
Since we're assuming this whole project is being run from your local system...
2. Create an ENV file with the following information:

PORT=3000[or your preferred port for Node to listen on]
MONGODB_URI=http://localhost

From the project's root directory
3. ...run ($ npm install).
4. ...create a 'db' folder, then run ($ mongod --dbpath "./db")
5. ...then run ($ node index.js) + ($ jest) in separate windows if jest is installed globally
6. ...or simply run ($npm test) if jest is installed locally.

B] Making requests:

The Jest suite is an automatic battery of requests to test the basic integrity of the server and its routes...

If a user wished to start the server and make custom calls against it themselves, the user would need to...

1. Install the program as described above (if not already done so),
2. Using a program which can custom-make requests, and target custom URLs (or URIs), target the desired route (either a proper or a breaking URI) with the URL, form a payload (empty, corrupt, or accurate), and then send off the requests to view the results.

Available endpoints are as follows:

[site]/signup
- This endpoint only responds to POST requests.
- When posted to with a username, email, and password, this route creates a corresponding user in the database, creates a crypto token for this user, and then returns the user and the token back to the client.
- Lacking a username, email, or password, this endpoint will send a 404 to the client

[site]/login
- This endpoint peels off the "Authorization" data from the header, and checks that the provided username/password are valid.
- If the incorrect Auth type is sent in the headers, it will fail with a 400.
- If 'Basic Authentication' values are not present in the 'Authentication' header keyword, it will fail with a 404.
- If a username or password value are not included in the Basic Auth header, it will return a 400.
- If the password does not match that of the user's retrieved from the database, the endpoint will fail with a 401.
- Surviving all those errors, this endpoint will send back an 'Auth Token' to the user, to be used in subsequent requests via 'Bearer-Auth'-style authentication.

[site]/cars
- This endpoint only responds to POST requests.
- When posted to with a valid 'car' object, this endpoint saves that object to the DB, and responds with that object, and a 200 Status Code.
- If an invalid Auth token is presented, this endpoint fails with a 400 status code.
- If for some reason there is a failure decrypting that token and associating it to a user, a 404 error is thrown.

[site]/cars:id 
- This endpoint only responds to GET requests.
- When posted to with an valid "car._id", this route will retrieve the Car with that '._id' from the local MongoDB, and then respond with that Car and a 200 Status Code.
- The route will fail with a 404 if a plantId is not provided in the URL call ("/cars/").
- This route responds with a variety of 400 error codes based upon the nature of the various errors that can occur during internal server operations, and a '500' as a catch-all for any error state not specifically defined.
