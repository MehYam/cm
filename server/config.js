const config = {
   mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/cm4',
   port: process.env.PORT || 3001,
   jwtSecret: process.env.JWT_SECRET || 'steve rockwell is jouko salomaa'
};

module.exports = config;