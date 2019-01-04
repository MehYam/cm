const logger = require('../logger');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('mongoose').model('User');
const config = require('../config');

passport.use(new GoogleStrategy(
   config.google,
   async (req, accessToken, refreshToken, profile, done) => {

      logger.debug('GoogleStrategy, looking up', profile.displayName, profile.id);

debugger;

      // find or create a user based on this profile
      // COPY/PASTA here with the facebook approach, not really worth consolidation though
      let user = null;
      try {
         user = await User.findOne({googleId: profile.id});
         if (!user) {
            logger.debug('google id not found, create new user');

            const userData = {
               googleId: profile.id,
               displayName: profile.displayName
            };
            user = new User(userData);
            await user.save();
         }
      }
      catch (err) {
         logger.error('error in GoogleStrategy', err);
      }
      done(null, user);
   }
));

logger.info('passport using google strategy');
