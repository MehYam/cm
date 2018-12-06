const express = require('express');
const passport = require('passport');
const logger = require('../../logger');
const router = new express.Router();

router.post('/login', (req, res, next) => {

   logger.info('processing login attempt');

   return passport.authenticate('local-signin', (err, token, userData) => {
      logger.info('passport.authenticate local-signin');

      if (err) {
         logger.warn('login failure', err);
         if (err.name === 'IncorrectCredentialsError') {
            return res.status(400).json({
               success: false,
               message: err.message
            });
         }

         return res.status(400).json({
            success: false,
            message: 'login authentication has failed'
         });
      }
      else if (!token) {
         //KAI: assume this is because of blank credentials.  The client shouldn't allow this case, but we still need to handle it
         logger.warn('login token failure');
         return res.status(400).json({
            success: false,
            message: 'missing account or password'
         })
      }

      return res.json({
         success: true,
         message: 'login successful',
         user: userData
      });
   })(req, res, next);
});

module.exports = router;