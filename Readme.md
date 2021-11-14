# passport-demo
Demo of the passport.js framework. Allows the registration of new users. Registered user can then use the login form to access content that is restricted to registered users.

## Requirements
This app uses express.js, passport.js and ejs views.

This app uses the multer middleware to parse the multipart/form-data sent by the forms.
- the forms must have set the `enctype="multipart/form-data"`
- ejs views must be placed in the dir specified on the line `app.set('views', './views');` in server.js

## DB Setup
Mongo DB can be run in a docker container like this:
```
docker run --name mongodb -d -p 27017:27017 mongo
```

## User Management
New Users can be registred by using the register.js form on the route `/register` and are stored in the configured Mongo DB

There is a Mongo DB Model for the users that perfoms some user data validation and hashing and salting of the password before the user is saved in the dattabase.

The Mongo DB Model also provides functions to verify a Users password.