const logger = require('../logger');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('mongoose').model('User');
const config = require('../config');

const fbConfig = { ...config.facebook };
fbConfig.profileFields = [ 'id', 'displayName', 'name', 'picture' ];

passport.use(new FacebookStrategy(
   fbConfig,
   async (accessToken, refreshToken, profile, done) => {

      logger.debug('FacebookStrategy, looking up', profile.displayName, profile.id);

      const photoUrl = profile.photos && profile.photos.length ? profile.photos[0].value : null;

      // either find or create a user based on this Facebook profile
      let user = null;
      try {
         user = await User.findOne({facebookId: profile.id});
         if (!user) {
            logger.debug('facebook id not found, creating new user');

            const userData = {
               facebookId: profile.id,
               displayName: profile.displayName
            };
            user = new User(userData);
            await user.save();
         }
         else if (photoUrl && photoUrl != user.photoUrl) {
            user.photoUrl = photoUrl;
            await user.save();
         }
      }
      catch (err) {
         logger.error('error in FacebookStrategy', err);
      }
      done(null, user);
   }
));

logger.info('passport using facebook strategy');