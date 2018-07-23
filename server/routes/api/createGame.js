const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Game = mongoose.model('Game');

const palette = require('../../data/palettes');

router.post('/createGame', (req, res, next) => {

   logger.info('createGame', req.url);

   // look for this player's ID
   logger.info('user', req.user);

   // look for player 2 ID in header, ensure it's valid
   logger.info('player 2', req.body.user);

   //KAI: this throws an exception
   //logger.info('objid', mongoose.Types.ObjectId(req.body.user));

   //KAI: if player 2 is missing, choose a user at random

   //KAI: ensure the game creator isn't also player 2

   User.findById(req.body.user, (findErr, player2) => {
      if (findErr || !player2) {
         logger.error('findById error in gatekeeper', findErr);
         return res.status(401).end();
      }

      const gameData = {
         seed: 0,
         width: 3,
         height: 3,
         players: [
            {
               user: req.user,
               palette: [0, 1, 2]
            },
            {
               user: player2,
               palette: [3, 4, 5]
            }
         ]
      };

      const newGame = new Game(gameData);
      newGame.save((err) => {

         if (err) {
            logger.error('new game creation error', err);
            return done(err);
         }
         res.json({
            here: true
         });
      });
   });
});

module.exports = router;