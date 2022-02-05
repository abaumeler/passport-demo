const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
let runmode

const arguments = process.argv.slice(2);
if(arguments[0] === 'dev'){
  runmode = 'dev';
  console.log('server running in development mode');
}else if(arguments[0] === 'prod'){
  runmode = 'prod';
  console.log('server running in production mode');
}else{
  console.log('provide run mode (dev|prod)');
  process.exit(0);
}

// Mongo DB Setup based on runmode
switch(runmode){
  case 'dev':
    mongoose.connect('mongodb://localhost:27017/passport-demo')
    mongoose.set('debug', true);
    break;
  case 'prod':
    mongoose.connect('mongodb+srv://'+process.env.MONGODB_USER+':'+process.env.MONGODB_PW+'@db-mongodb-fra1-25982-d954fc61.mongo.ondigitalocean.com/passport-demo?authSource=admin&replicaSet=db-mongodb-fra1-25982&tls=true&tlsCAFile=ca-certificate.crt.txt');
    mongoose.set('debug', false);
    break;
}

// Database Models
require('./models/User');

// Create global Express JS app object
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require('./config/passport-config');

// Configure CORS based on runmode
const corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

switch (runmode){
  case 'dev':
   //allow all origins in dev mode
   app.use(cors());
   app.options('*', cors()); //enable preflight for all
   break;
  case 'prod':
   app.use(cors(corsOptions));
   break;
}

// Route handling
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler for development
if(runmode === 'dev'){
  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

// Production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

switch (runmode){
  case 'dev':
   console.log('server listening on Port: 3000');
   app.listen(3000);
   break;
  case 'prod':
    console.log('server listening on Port: '+process.env.PORT);
    app.listen(process.env.PORT);
    break;
}
