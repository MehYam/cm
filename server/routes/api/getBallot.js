const logger = require('../../logger');
const express = require('express');
const Chance = require('chance');
const chance = new Chance();

const router = new express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

const BALLOTSIZE = 3;

router.get('/getBallot', async (req, res, next) => {

   logger.info('getBallot');

   const user = req.user;

   // get any existing unfinished ballot for this user
   var ballot = user.currentBallot;

   // if none exists, generate one and store it in the user doc
   if (!ballot || !ballot.length) {

      logger.info('generating ballot for', user.name);

      // create a ballot from BALLOTSIZE completed games
      try {
         const games = await Game.find({ completed: { $ne: null }})

         const numGames = Math.min(games.length, BALLOTSIZE);
         const randoms = chance.unique(chance.natural, numGames, {min: 0, max: games.length-1});
         ballot = [];

         //KAI: need to scrub this data of user-specific info to ensure anonymity
         randoms.forEach(r => { ballot.push(games[r]) });

         user.currentBallot = ballot;

         logger.info('currentBallot length:', ballot.length);
         await user.save();
      }
      catch (err) {
         return res.status(500).send(err);
      }
   }
   res.json({ballot});
});


module.exports = router;