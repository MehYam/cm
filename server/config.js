const config = {
   mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/cm4',
   port: process.env.PORT || 3001
};

module.exports = config;