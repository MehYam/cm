const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

router.get('/getBadges', async (req, res, next) => {

   const user = req.user;
   try {
      const games = await Game.find({ 
         completed: null, 
         players: { $elemMatch: { user: user._id } }
      });
      
      res.json({ 
         badges: { readyGames: games.length }
      });
   }
   catch (err) {
      logger.error('getBadges failure', err);
      return res.status(400).send(err);
   }
});


module.exports = router;