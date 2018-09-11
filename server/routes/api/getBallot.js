const logger = require('../../logger');
const express = require('express');
const Chance = require('chance');
const chance = new Chance();

const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');

const BALLOTSIZE = 3;

router.get('/getBallot', (req, res, next) => {

   logger.info('getBallot');

   // KAI: this is quick and dirty, and probably scales badly

   // choose N completed games at random
   Game.find({ completed: { $ne: null }}).lean().exec((err, games) => {
      if (err || !games) {
         logger.error('games not found', err);
      }

      const numGames = Math.min(games.length, BALLOTSIZE);
      const randoms = chance.unique(chance.natural, numGames, {min: 0, max: games.length-1});
      const ballot = [];

      //KAI: need to scrub this data of user-specific info to ensure anonymity
      randoms.forEach(r => {
         ballot.push(games[r]);
      })
      res.json({ ballot });
   });
});

module.exports = router;