const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const logger = require('../logger');

module.exports = new PassportLocalStrategy({
   usernameField: 'name',
   passwordField: 'password',
   session: false,
   passReqToCallback: true
}, (req, name, password, done) => {

   const trimmedName = name.trim();
   const userData = {
      name: trimmedName,
      displayName: trimmedName,
      password: password.trim()
   };

   const newUser = new User(userData);
   newUser.save((err) => {
      if (err) {
         logger.error('new user creation error', err);
         return done(err);
      }
      return done(null);
   })
});