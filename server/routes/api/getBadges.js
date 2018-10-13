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
      
      // loop through the games to find those on our turn
      const thisUserId = String(user._id);
      const ourTurn = games.reduce((total, game) => {
         const playerIndex = game.players.findIndex(player => String(player.user) === thisUserId);
         return Number(playerIndex == game.moves.length % game.players.length) + total;
      }, 0);

      res.json({ badges: { readyGames: ourTurn } });
   }
   catch (err) {
      logger.error('getBadges failure', err);
      return res.status(400).send(err);
   }
});


module.exports = router;