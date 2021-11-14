const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require ('mongoose')
const multer = require('multer');
const upload = multer();

// Mongo DB Setup
mongoose.connect('mongodb://localhost:27017/passport-demo')
mongoose.set('debug', true);

require('./models/User')
let User = mongoose.model('User');

// Create global Express JS app object
const app = express();
app.set('views', './views');
app.set('view-engine', 'ejs');

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

app.post('/register', upload.none(), (req, res) => {
   console.log(req.body);
   let user = new User();
   user.name = req.body.name;
   user.email = req.body.email;
   user.setPassword(req.body.password)
   user.save().then(function(){console.log('user saved')});
   res.render('login.ejs');
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