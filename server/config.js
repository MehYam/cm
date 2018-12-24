const config = {
   mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/cm4',
   port: process.env.PORT || 3001,
   auth: {
      secret: process.env.JWT_SECRET || 'steve rockwell is jouko salomaa v2',
      issuer: process.env.JWT_ISSUER || 'some issuer',
      audience: process.env.JWT_AUDIENCE || 'some audience'
   },
   facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL
   }
};

module.exports = config;