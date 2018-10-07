const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

router.post('/getGame', (req, res, next) => {

   const gameId = req.body.game;
   logger.info('/getGame', 'gameId:', gameId);

   Game.findById({ _id: gameId }).lean().exec((findErr, game) => {
      if (findErr || !game) {
         logger.error('game not found', findErr);
         return res.status(400).send('game not found');
      }
      res.json({game});
   });
});

module.exports = router;