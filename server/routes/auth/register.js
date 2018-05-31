const express = require('express');
const passport = require('passport');
const logger = require('../../logger');
const router = new express.Router();

router.post('/register', (req, res, next) => {

   //KAI: validate first
   logger.info('processing registration');

   return passport.authenticate('local-signup', (err) => {
      if (err) {

         logger.error('register.js error in passport.authenticate', err);
         if (err.name === 'MongoError' && err.code === 11000) {
            // dupe index, return a 409
            return res.status(409).json({
               success: false,
               message: 'Username already registered'
            });
         }

         return res.status(400).json({
            success: false,
            message: 'Error in authentication, check the logs'
         });
      }

      return res.status(200).json({
         success: true,
         message: 'Registration successful, you can now log in'
         //KAI: they should be logged in automatically from here, but this is useful for now
      });
   })(req, res, next);
});

module.exports = router;