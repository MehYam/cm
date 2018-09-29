const logger = require('../../logger');
const tokenToUser = require('./tokenToUser');

// this middleware guards against unauthorized access of whatever paths come after

module.exports = async (req, res, next) => {
   logger.info('--- gatekeeper middleware fielding request at', req.url);
   if (!req.headers.authorization) {
      logger.error('--- DENIED - missing auth token');
      return res.status(401).end();
   }

   try {
      // found the user, pass it along to the middleware route handler(s)
      const user = await tokenToUser(req.headers.authorization)
      req.user = user;
      next();
   }
   catch (err) {
      logger.error('--- DENIED - error in authorization', err);
      return res.status(401).end();
   }
};