const express = require('express');
const passport = require('passport');
const logger = require('../../logger');
const router = new express.Router();

router.post('/login', (req, res, next) => {

   logger.info('processing login attempt');

   return passport.authenticate('local-login', (err, token, userData) => {
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

      return res.json({
         success: true,
         message: 'login successful',
         user: userData
      });
   });
});

module.exports = router;