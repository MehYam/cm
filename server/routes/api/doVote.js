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
      logger.error('user attempting to vote without ballot', String(user._id), user.displayName);
      return res.status(400).send('voting without ballot');
   }
   try {
      //KAI: exploit possibility?  with the right timing, it may be possible to vote multiple times per ballot.  Not sure how to 
      // critical-section the voting record, but for now we're not building Fort Knox here.

      // remove the current user's ballot
      logger.info('removing user ballot and saving', String(user._id), user.displayName);
      user.currentBallot = null;
      await user.save();

      const index = req.body.index;
      if (index < 0 || index >= ballot.length) {
         throw 'bad winner index';
      }

      const winnerId = ballot[index]._id;
      logger.info('winnerId', winnerId.toString());

      // loop the ballot, crediting wins and losses to each game
      for (let candidate of ballot ) {
         const game = await Game.findById(candidate._id);
         if (!game) throw 'game not found';

         ++game.ballots;

         if (candidate._id === winnerId) {
            ++game.votes;
         }
         logger.info('saving game', String(game._id));
         await game.save();
      }
   }
   catch (err) {
      logger.error('doVote error:', err);
      return res.status(400).send(err);
   }

   logger.info('end of doVote');
   res.json({});
});

module.exports = router;