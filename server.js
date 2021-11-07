const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require ('mongoose')

mongoose.connect('mongodb://localhost:27017/passport-demo')
mongoose.set('debug', true);

require('./models/User')
var User = mongoose.model('User');

// Create global app object
const app = express()
app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
    res.redirect('/login');
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})

app.post('/register', (req, res) => {
   var user = new User();
   //user.name = req.header.name;
   //user.email = req.header.email;
   //user.setPassword(req.header.password)
   user.name = 'a';
   user.emai = 'a@a';
   user.setPassword('a')

   user.save().then(function(){console.log('user saved')});
});

// Error handlers
app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
    message: err.message,
    error: err
    }});
});

app.listen(3000);