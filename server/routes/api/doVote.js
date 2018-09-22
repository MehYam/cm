const logger = require('../../logger');
const express = require('express');

const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

router.post('/doVote', async (req, res, next) => {

   logger.info('doVote');

   const user = req.user;
   const ballot = user.currentBallot;
   if (!ballot || !ballot.length) {
      logger.error('user attempting to vote without ballot', user.name);
      return res.status(400).send('voting without ballot');
   }
   try {
      const index = req.body.index;
      if (index < 0 || index >= ballot.length) {
         throw 'bad winner index';
      }

      const winnerId = ballot[index]._id;

      // loop the ballot, crediting wins and losses to each game
      for (let candidate of ballot ) {
         const game = await Game.findById(candidate._id);
         ++game.ballots;

         if (candidate._id === winnerId) {
            ++game.votes;
         }
         logger.info('saving game', game._id);
         await game.save();
      }

      //KAI: exploit possibility?  with the right timing, it may be possible to vote multiple times per ballot.  Not sure how to 
      // critical-section the voting record, but for now we're not building Fort Knox here.

      // remove the current user's ballot
      logger.info('removing user ballot and saving', user.name);
      user.currentBallot = null;
      await user.save();
   }
   catch (err) {
      logger.error('doVote error:', err);
      return res.status(400).send(err);
   }

   logger.info('end of doVote');
   res.json({});
});

module.exports = router;