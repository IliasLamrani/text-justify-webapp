## Justify text API
#### REST API made with NodeJS and JWT

API available at: https://justify-text--node-api.herokuapp.com/

This little API has multiple endpoints.

You first have to create an account by calling ***/api/token***.
This is juste a little project so the users are directly stored on the server and not in a DB. Email and password provided during the account creation can be random, it's not important (again, this is juste a little basic project).

After submission, you'll receive a token. You have to provide it for each call to the ***/api/justify*** endpoint. A maximum of 8000 words can be justified per day. It will be reset automatically every 24 hours.
The text you want to format must be sent as text/plain in your request.

Unit tests can be launched with the ***npm test*** command but the server must be running. To do so, a ***JWT_SECRET_KEY*** environment variable must be set, and the ***npm start*** command executed. It will run on the port 3000.

Tests on the server are also performed but the coverage is not available.

A little rest file is also available on the repo. You can use it to try the API. You'll have to open it on vscode (you might also have to install the rest client extension).

![alt text](https://github.com/Shelyp/text-justify-API/blob/master/misc/justify-text-coverage.png?raw=true)