var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
const bcrypt = require('bcrypt');
var csrf = require('csurf')
var passport = require("passport")
var User = require("../models/user");
var csrfProtection = csrf({ cookie: true })
const { ensureAuthenticated, forwardAuthenticated } = require('../auth/auth');

/* GET users listing. */
router.use(csrfProtection)
router.use(flash())

router.get("/profile",ensureAuthenticated, (req, res, next)=>{
  // req.toastr.success('Successfully logged in.', "You're in!");
res.render("users/profile", {user: req.user})
})


router.get("/", forwardAuthenticated, (req, res, next)=>{
  next();
})
router.get('/',csrfProtection, function(req, res, next) {
  res.render("users/signup", {csrfToken: req.csrfToken()});
  
});
router.get("/user-login", csrfProtection, (req, res, next)=>{
  res.render("users/login", {csrfToken: req.csrfToken()})
})

router.post('/register', (req, res) => {
  const { email, password} = req.body;
  let errors = [];

  if ( !email || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }


  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      email,
      password
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,

          email,
          password
        });
      } else {
        const newUser = new User({
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/user-login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/user-login',
    failureFlash: true
  })(req, res, next);
});
  

  router.get('/logout', (req, res, next)=>{
    req.logout();
    res.redirect('/');
  })
module.exports = router;
