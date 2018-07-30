const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Game = mongoose.model('Game');

require('seedrandom');

//KAI: this should come from the db, eventually
const gameSettings = {
   width: 3,
   height: 3,
   playerPaletteSize: 7
};
gameSettings.palette = require('../../data/palettes');

function chooseRandomOpponent(thisUser, callback) {
   //KAI: ensure the game creator isn't also player 2
   throw 'implement chooseRandomOpponent';
}
function createGame(playerIds, settings) {
   const totalPlayerColors = playerIds.length * settings.playerPaletteSize;

   logger.info("colors", totalPlayerColors, settings.width, 'x', settings.height);
   logger.assert(playerIds && playerIds.length > 1, 'not enough players');
   logger.assert(totalPlayerColors >= (settings.width * settings.height), 'not enough player colors for board');
   logger.assert(totalPlayerColors <= settings.palette.length, 'palette too small for players');

   // create a game representation for storage in the db
   Math.seedrandom();
   const gameData = 
   {
      seed: Math.random(),
      width: settings.width,
      height: settings.height,

      players: [],
      moves: []
   };
   Math.seedrandom(gameData.seed);

   // fill out the player states, including randomized palettes
   const colorsUsed = [];
   function addPlayer(id) {
      const player = {
         user: id,
         palette: []
      };
      for (let i = 0; i < settings.playerPaletteSize; ++i) {

         // choose a color, unique across both players
         let colorIdx = Math.floor(Math.random() * settings.palette.length);
         while(colorsUsed.indexOf(settings.palette[colorIdx]) != -1) {
            ++colorIdx;
            if (colorIdx >= settings.palette.length) {
               colorIdx = 0;
            }
         }
         const color = settings.palette[colorIdx];
         colorsUsed.push(color);
         player.palette.push(color);
      }
      return player;
   }
   playerIds.forEach((id) => {
      console.log('adding player ', id);
      gameData.players.push(addPlayer(id));
   })
   console.log('done creating game');

   return gameData;
}

router.post('/createGame', (req, res, next) => {

   logger.info('createGame', req.url);

   // look for this player's ID
   logger.info('user', req.user);

   // find an opponent - look in the request first
   let opponent = req.body.user;
   if (!opponent) {
      opponent = chooseRandomOpponent();
   }
   logger.info('player 2', opponent);

   //KAI: this throws an exception
   //logger.info('objid', mongoose.Types.ObjectId(req.body.user));

   User.findById(opponent, (findErr, opponent) => {
      if (findErr || !opponent) {
         logger.error('findById error ', findErr);
         return res.status(401).end();
      }

      const gameData = createGame([req.user, opponent], gameSettings)
      const newGame = new Game(gameData);
      newGame.save((err) => {

         if (err) {
            logger.error('new game creation error', err);
            return done(err);
         }
         res.json({ gameId: newGame._id });
      });
   });
});

module.exports = router;