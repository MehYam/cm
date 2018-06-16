const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const logger = require('../logger');
const config = require('../config');

function failedLoginError() {
   const error = new Error('Incorrect name or password');
   error.name = 'IncorrectCredentialsError';
   return error;
}
module.exports = new PassportLocalStrategy({
   usernameField: 'name',
   passwordField: 'password',
   session: false,
   passReqToCallback: true
}, (req, name, password, done) => {

   logger.info('passportLoginStrategy for', name);

   const userData = {
      name: name.trim(),
      password: password.trim()
   };

   // find the user by name
   return User.findOne({ name: userData.name}, (err, user) => {
      if (err) {
         logger.error('User.findOne failure', err);
         return done(err);
      }

      if (!user) {
         return done(failedLoginError());
      }

      // found the user, check the password
      return user.comparePassword(userData.password, (passwordErr, isMatch) => {

         if (passwordErr) {
            logger.error('user.comparePassword failure', passwordErr);
            return done(passwordErr);
         }
         if (!isMatch) {
            logger.error('user.comparePassword not a match');
            return done(failedLoginError());
         }

         const payload = { sub: user._id };
         const token = jwt.sign(payload, config.jwtSecret);
         const data = { name: user.name, isAdmin: false, isGuest: false };

         //KAI: token's not showing up in the client's response header for axios reasons.  Hack it into the response body for now
         data.token = token;

         return done(null, token, data);
      });
   });
});