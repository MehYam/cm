// with help from https://www.sitepoint.com/spa-social-login-google-facebook/

const logger = require('../logger');

const passport = require('passport');
const passportJwt = require('passport-jwt');
const config = require('../config');

const User = require('mongoose').model('User');

const options = {
   // client must append "JWT" prefix to Authorization header
   jwtFromRequest: passportJwt.ExtractJwt.fromHeader('authorization'),
   secretOrKey: config.auth.secret
};

passport.use(new passportJwt.Strategy(options, async(decoded, done) => {

   const user = await User.findById(decoded.sub);
   if (user) {
      logger.info('JWT user authed:', user.displayName);
      return done(null, user, decoded);
   }
   logger.error('JWT user not found');
   return done();
}));

logger.info('passport using JWT strategy');