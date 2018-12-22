const logger = require('../../logger');
const express = require('express');

const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');

const ModelUtils = require('../../modelUtils');

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
         },
         {
            $sort: { score: -1 }
         }
      ]);
      res.json({ leaders });

      ModelUtils.setUserActivity(user, 'browsing leaderboard');
   }
   catch(err) {
      logger.error('getLeaders failure', err);
      res.status(400).send(err);
   }
})

module.exports = router;