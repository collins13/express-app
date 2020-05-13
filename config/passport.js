var passport = require("passport");
var User = require("../models/user");
var LocalStrategy =  require("passport-local").Strategy;
var bcrypt = require("bcrypt")
// passport.serializeUser((user, done) =>{
//     done(null, user.id)
// });

// passport.deserializeUser((id, done) =>{
//     User.findById()
//     .then((user) => {
//         done(null, user)
//     }).catch((err) => {
//         done(null, err)
//     });
// })

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};