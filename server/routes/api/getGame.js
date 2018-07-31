const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

router.post('/getGame', (req, res, next) => {

   const thisUser = req.user;
   const gameId = req.body.game;

   logger.info('/getGame', thisUser.name, 'body', req.body, 'gameId:', gameId);

   Game.findById({ _id: gameId }).lean().exec((findErr, game) => {
      if (findErr || !game) {
         logger.error('game not found', findErr);
         //KAI: should really return errors to the client so it can display them
         return res.status(401).end();
      }

      // client user doesn't know it's own _id, so mark the current user so they know which player they are
      game.players.forEach((player) => {
         player.you = String(player.user) == String(thisUser._id);
      })
      res.json({game});
   });
});

module.exports = router;