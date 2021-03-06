const logger = require('../logger');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('mongoose').model('User');
const config = require('../config');

if (config.google.clientID) {
   logger.info('passport using GoogleStrategy');

   passport.use(new GoogleStrategy(
      config.google,
      async (req, accessToken, refreshToken, profile, done) => {

         logger.debug('GoogleStrategy, looking up', profile.displayName, profile.id);

         // find or create a user based on this profile
         // COPY/PASTA here with the facebook approach, not really worth consolidation though
         const photoUrl = profile.photos && profile.photos.length ? profile.photos[0].value : null;

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
            else if (photoUrl && photoUrl != user.photoUrl) {
               user.photoUrl = photoUrl;
               await user.save();
            }
         }
         catch (err) {
            logger.error('error in GoogleStrategy', err);
         }
         done(null, user);
      }
   ));
}
else {
   logger.warn('no google clientId found, omitting GoogleStrategy');
}
