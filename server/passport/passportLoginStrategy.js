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

         if (err) {
            logger.error('user.comparePassword failure', err);
            return done(err);
         }
         if (!isMatch) {
            return done(failedLoginError());
         }

         const payload = { sub: user._id };
         const token = jwt.sign(payload, config.jwtSecret);
         const data = { name: user.name };

         return done(null, token, data);
      });
   });
});