const logger = require('../../logger');
const express = require('express');

const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');

router.get('/getLeaders', async (req, res, next) => {

   logger.info('getLeaders');

   const user = req.user;
   try {
      const leaders = await Game.aggregate([ 
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
      return res.json({ leaders });
   }
   catch(err) {
      logger.error('getLeaders failure', err);
      return res.status(400).send(err);
   }
})

module.exports = router;