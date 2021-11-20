const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const passport = require('passport');
const auth = require('./middleware/auth');

// Mongo DB Setup
mongoose.connect('mongodb://localhost:27017/passport-demo')
mongoose.set('debug', true);

require('./models/User')
let User = mongoose.model('User');

// Create global Express JS app object
const app = express();
app.set('views', './views');
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require('./config/passport-config');

// Route handling
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.get('/user', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then((user) => {
    if (!user) { return res.sendStatus(401); }

    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
});

app.post('/register', (req, res, next) => {
  let user = new User();
  console.log(req)
  user.name = req.body.user.name;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
  user.save().then(function () {
    return res.json(user.toAuthJSON());
  }).catch(next);
});

app.post('/login', (req, res, next) =>{
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

app.listen(3000);