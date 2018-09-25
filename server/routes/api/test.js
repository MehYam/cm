const logger = require('../../logger');
const express = require('express');

const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

router.post('/test', async (req, res, next) => {

   logger.info('test');

   const user = req.user;

   try {
      const result = await Game.aggregate([ 
         {
            $match: { 
               completed: { $ne: null }, 
               ballots: { $gt: 0 }
            }
         },
         {
            $addFields: {
               score: { '$divide': ['$votes', '$ballots'] }
            }
         }
      ]);

      logger.info('test result', result);
   }
   catch(err) {
      logger.error('test failure', err);
      return res.status(400).send(err);
   }
   res.json({message: 'done'});
})

module.exports = router;