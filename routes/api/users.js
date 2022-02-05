const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const auth = require('../../middleware/auth');

router.get('/user', auth.required, (req, res, next) => {
    console.log('get /user');
    User.findById(req.payload.id).then((user) => {
      if (!user) { return res.sendStatus(401); }
      return res.json({ user: user.toAuthJSON() });
    }).catch(next);
});

router.post('/users/login', (req, res, next) =>{
    console.log('post /users/login');
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

router.post('/users/register', (req, res, next) => {
    console.log('post /users/register');
    let user = new User();
    user.name = req.body.user.name;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);
    user.save().then(function () {
      return res.json(user.toAuthJSON());
    }).catch(next);
});
  
router.post('users/login', (req, res, next) =>{
    console.log('post /users/login');
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

module.exports = router;