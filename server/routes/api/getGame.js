const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

router.post('/getGame', (req, res, next) => {

   const thisUser = req.user._id;
   const gameId = req.body.gameId;

   Game.findById({ _id: req.body.gameId }, (findErr, game) => {
      if (findErr || !game) {
         logger.error('game not found', findErr);
         //KAI: should really return errors to the client so it can display them
         return res.status(401).end();
      }

      res.json({game});
   });
});

module.exports = router;