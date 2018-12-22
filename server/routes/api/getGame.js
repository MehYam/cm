const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

const ModelUtils = require('../../modelUtils');

router.post('/getGame', async (req, res, next) => {

   const gameId = req.body.game;
   logger.info('/getGame', 'gameId:', gameId);

   try {
      const game = await Game.findById({ _id: gameId }).lean().exec();
      res.json({game});

      await ModelUtils.setUserActivity(req.user, 'examining game ' + gameId);
   }
   catch(err) {
      logger.error('game not found', err);
      res.status(400).send('game not found');
   }
});

module.exports = router;