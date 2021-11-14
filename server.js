const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require ('mongoose')
const multer = require('multer');
const upload = multer();
const passport = require('passport');

// Mongo DB Setup
mongoose.connect('mongodb://localhost:27017/passport-demo')
mongoose.set('debug', true);

require('./models/User')
let User = mongoose.model('User');

// Create global Express JS app object
const app = express();
app.set('views', './views');
app.set('view-engine', 'ejs');
require('./passport-config');

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

app.post('/register', upload.none(), (req, res, next) => {
   console.log(req.body);
   let user = new User();
   user.name = req.body.name;
   user.email = req.body.email;
   user.setPassword(req.body.password)
   user.save().then(function(){
    return res.render('./login.ejs');
  }).catch(next);
});

app.post('/login', upload.none(), function(req, res, next){
    console.log(req.body);
    if(!req.body.email){
      return res.status(422).json({errors: {email: "can't be blank"}});
    }
  
    if(!req.body.password){
      return res.status(422).json({errors: {password: "can't be blank"}});
    }
  
    passport.authenticate('local', {session: false}, function(err, user, info){
      if(err){ return next(err); }
  
      if(user){
        return res.render('./index.ejs',{name: user.name});
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

    res.json({'errors': {
    message: err.message,
    error: err
    }});
});

app.listen(3000);