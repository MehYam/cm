const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

router.post('/doMove', (req, res, next) => {

   const thisUser = req.user;
   const gameId = req.body.game;

   logger.info('/doMove', thisUser.name, 'gameId:', gameId, 'body', req.body);

   // look up the game
   Game.findById({ _id: gameId }).exec((findErr, game) => {

      try {
         if (findErr || !game) {
            //KAI: propagate these errors to the client
            throw 'game not found ' + findErr;
         }

         if (game.completed || ((game.width * game.height) <= game.moves)) {
            throw 'trying to move in a completed game';
         }

         const playerIndex = game.players.findIndex(player => String(player.user) == String(thisUser._id));
         if (playerIndex < 0) {
            throw 'player not in this game';
         }

         const you = game.players[playerIndex];

         if (playerIndex != (game.moves.length % game.players.length)) {
            throw "not this player's turn";
         }

         const { paletteIndex, row, col } = req.body;
         const validRanges = 
            paletteIndex >= 0 && paletteIndex < you.palette.length &&
            row >= 0 && row < game.height &&
            col >= 0 && col < game.width;

         if (!validRanges) {
            throw 'invalid doMove arguments ' + paletteIndex + ', ' + row + ', ' + col;
         }

         if (game.moves.find(move => move.x == col && move.y == row)) {
            throw 'board space non-empty';
         }

         if (game.moves.find(move => move.paletteIdx == paletteIndex)) {
            throw 'color already used';
         }

         // everything checks out, make the move
         game.moves.push({ x: col, y: row, paletteIdx: paletteIndex});
         game.save((err, updatedGame) => {
            if (err) {
               logger.error('game.save', err);
               res.status(400).json({ error: err });
            }
            else {
               res.send(updatedGame);
            }
         });
      }
      catch(error) {
         logger.error(error);
         return res.status(400).send(error);
      }
   });
});

module.exports = router;