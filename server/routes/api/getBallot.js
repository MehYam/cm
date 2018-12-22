const logger = require('../../logger');
const express = require('express');

const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

const ModelUtils = require('../../modelUtils');

const BALLOTSIZE = 3;

router.get('/getBallot', async (req, res, next) => {

   logger.info('getBallot');

   const user = req.user;

   // create a ballot for this player unless they've got one saved
   if (!user.currentBallot || !user.currentBallot.length) {

      logger.info('generating ballot for', user.name);

      // create a ballot from BALLOTSIZE completed games
      try {
         //KAI: need to scrub this data of user-specific info to ensure anonymity - $project helps here
         const games = await Game.aggregate([ {$match: { completed: { $ne: null } } },  {$sample: {size: 3}} ]);
         user.currentBallot = games;

         logger.info('currentBallot length:', user.currentBallot.length);
         await user.save();

         ModelUtils.setUserActivity(user, 'voting');
      }
      catch (err) {
         return res.status(400).send(err);
      }
   }
   res.json({ballot: user.currentBallot});
});


module.exports = router;