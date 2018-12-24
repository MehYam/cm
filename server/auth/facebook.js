const logger = require('../logger');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const config = require('../config');

passport.use(new FacebookStrategy(
   config.facebook,
   async (accessToken, refreshToken, profile, done) => {

      logger.debug('FacebookStrategy', accessToken, refreshToken, profile);

      // find or create the user, will have to await here

      done(null, null);
   }
));