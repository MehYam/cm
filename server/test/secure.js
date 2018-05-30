const logger =  require('../logger');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');

var requests = 0;

router.use((req, res, next) => {

   if (++requests % 2) {
      logger.debug('middleware permitting odd requests only, #', requests);
      next();
   }
   else {
      logger.warn('middleware rejecting even request #', requests);
      next(createError(401));
   }
});

module.exports = router;