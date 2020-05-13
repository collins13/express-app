var passport = require('passport');
module.exports = (passport)=>{
    passport.authenticate('basic', { session: false, successRedirect:'/users/user-login' });
}