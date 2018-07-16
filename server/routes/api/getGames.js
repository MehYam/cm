const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');

router.post('/getGames', (req, res, next) => {

   logger.info('getGames');

   // all games
   // Game.find({}, (findErr, results) => {

   //    logger.info('elemMatch returns');
   //    if (findErr || !results) {
   //       logger.error('elemMatch error in getGames', findErr);
   //       return res.status(401).end();
   //    }
   //    res.json({
   //       games: results
   //    });
   // });

   // find all games for this user
   // {players: { $elemMatch: { user: ObjectId("5b10474ef20ae727305b8226") } } }

   logger.warn('testing getGames with a hard-coded ID');
   Game.find().elemMatch('players', {'user': mongoose.Types.ObjectId('5b10474ef20ae727305b8226')}).exec((findErr, results) => {

      logger.info('elemMatch returns');
      if (findErr || !results) {
         logger.error('elemMatch error in getGames', findErr);
         return res.status(401).end();
      }
      res.json({
         games: results
      });
   });
});

module.exports = router;