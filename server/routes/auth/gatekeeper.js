const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../../config');
const logger = require('../../logger');

// this middleware guards against unauthorized access of whatever paths come after

module.exports = (req, res, next) => {
   logger.info('gatekeeper fielding request at', req.url);
   if (!req.headers.authorization) {
      logger.error('DENIED');
      return res.status(401).end();
   }

   const token = req.headers.authorization.trim();

   // decode the token
   return jwt.verify(token, config.jwtSecret, (err, decoded) => {

      if (err) {
         logger.error('error in authorization', err);
         return res.status(401).end();
      }

      const userId = decoded.sub;
      return User.findById(userId, (findErr, user) => {
         if (findErr || !user) {
            logger.error('findById error in gatekeeper', findErr);
            return res.status(401).end();
         }

         // found the user, pass it along to the next route
         req.user = user;
         return next();
      });
   });
};