# passport-demo
Demo of the passport.js framework

## Requirements
This app uses ejs views and the multer middleware to parse the multipart/form-data sent by the forms.
- the forms must have set the `enctype="multipart/form-data"`
- ejs must be placed in the dir specified on the line `app.set('views', './views');` in server.js

## DB Setup
Mongo DB can be run in a docker container like this:
```
docker run --name mongodb -d -p 27017:27017 mongo
```