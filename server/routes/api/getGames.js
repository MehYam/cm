const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

router.get('/getGames', (req, res, next) => {

   const user = req.user;
   logger.info('getGames', user.name);

   // {players: { $elemMatch: { user: ObjectId(...) } } }
   Game.find().lean().elemMatch('players', {'user': user._id}).exec((findErr, games) => {

      logger.info('elemMatch returns', games && games.length);
      if (findErr || !games) {
         logger.error('elemMatch error in getGames', findErr);
         return res.status(401).end();
      }

      if (!games.length) {
         // morally I'm against special code for returning the null-or-empty case, but it avoids 
         // round-trips to mongo with empty queries below
         return res.json({games: []});
      }

      // right now each game only has the _id of the players - look up the client-displayable names
      // and inject them into the response
      const idsToNames = {};
      let debug_playerCount = 0;
      games.forEach((game) => {
         game.players.forEach((player) => {
            // just add an entry for now
            idsToNames[player.user] = null;
         });
      });

      const ids = Object.keys(idsToNames);

      console.log(ids);

      // ids is the array of player _id's, resolve them into pretty names
      User.find({_id: { $in: ids }}, {name: 1}).lean().exec((findIdsErr, users) => {
         if (findIdsErr || !users || !users.length) {
            logger.error('error finding pretty names', findIdsErr, users);
            return res.status(401).end();
         }

         users.forEach((user) => {
            idsToNames[user._id] = user.name;
         });

         //console.log(idsToNames);

         games.forEach((game) => {
            game.players.forEach((player) => {
               player.name = idsToNames[player.user._id.toString()];
            });
         });

         res.json({ games });
      });
   });
});

module.exports = router;