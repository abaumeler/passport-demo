const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const passport = require('passport');
const auth = require('./middleware/auth');
const env = require('dotenv').config();
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

const corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Mongo DB Setup
if(runmode === 'prod'){
  mongoose.connect('mongodb+srv://'+process.env.MONGODB_USER+':'+process.env.MONGODB_PW+'@db-mongodb-fra1-25982-d954fc61.mongo.ondigitalocean.com/passport-demo?authSource=admin&replicaSet=db-mongodb-fra1-25982&tls=true&tlsCAFile=ca-certificate.crt.txt');
  mongoose.set('debug', false);
}

if (runmode === 'dev'){
  mongoose.connect('mongodb://localhost:27017/passport-demo')
  mongoose.set('debug', true);
}



require('./models/User')
let User = mongoose.model('User');

// Create global Express JS app object
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require('./config/passport-config');

switch (runmode){
  case 'dev':
   //allow all origins in dev mode
   app.use(cors());
   break;
  case 'prod':
   app.use(cors(corsOptions));
   break;
}


// Route handling
app.get('/user', auth.required, (req, res, next) => {
  console.log('get /user');
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }

    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
});

app.get('/test', (req, res, next) => {
  console.log('get /test');
  return res.json('test: testData');
});

app.post('/register', (req, res, next) => {
  console.log('post /register');
  let user = new User();
  user.name = req.body.user.name;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
  user.save().then(function () {
    return res.json(user.toAuthJSON());
  }).catch(next);
});

app.post('/login', (req, res, next) =>{
  console.log('post /login');
  console.log(req.body);
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
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
