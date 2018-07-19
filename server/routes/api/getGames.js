const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

router.post('/getGames', (req, res, next) => {

   logger.info('getGames');

   // {players: { $elemMatch: { user: ObjectId(...) } } }

   logger.warn('testing getGames with a hard-coded ID');
   Game.find().elemMatch('players', {'user': req.user._id}).exec((findErr, games) => {

      logger.info('elemMatch returns', games && games.length);
      if (findErr || !games) {
         logger.error('elemMatch error in getGames', findErr);
         return res.status(401).end();
      }

      // add in the player names for the client's convenience
      const idsToNames = {};
      let debug_playerCount = 0;
      games.forEach((game) => {
         game.players.forEach((player) => {
            // just add an entry for now
            idsToNames[player.user] = null;
         });
      });

      const ids = Object.keys(idsToNames);

      // look up the pretty names for the player ids and write them into the client's response
      User.find({_id: { $in: ids }}, {name: 1}, (findIdsErr, users) => {
         if (findIdsErr || !users || !users.length) {
            logger.error('error finding pretty names', findIdsErr);
            return res.status(401).end();
         }

         users.forEach((user) => {
            idsToNames[user._id] = user.name;
         });

         res.json({ games });
      });
   });
});

module.exports = router;