const logger = require('../logger');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('mongoose').model('User');
const config = require('../config');

passport.use(new FacebookStrategy(
   config.facebook,
   async (accessToken, refreshToken, profile, done) => {

      logger.debug('FacebookStrategy, looking up', profile.displayName);

      // either find or create a user based on this Facebook profile
      let user = null;
      try {
         user = await User.findOne({facebookId: profile.id});

if (user)  logger.debug('found facebook user', user._id);

         if (!user) {
            logger.debug('facebook id not found, creating new user');

            const userData = {
               facebookId: profile.id,
               displayName: profile.displayName
            };
            user = new User(userData);
            await user.save();
         }
      }
      catch (err) {
         logger.error('error in FacebookStrategy', err);
      }
      done(null, user);
   }
));