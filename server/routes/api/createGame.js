const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Game = mongoose.model('Game');

const liveConnection = require('../../liveConnection');

require('seedrandom');

//KAI: doVote vs. createGame vs. doCreateGame?  Consistencizer it
//KAI: this should come from the db, eventually
const gameSettings = {
   width: 3,
   height: 3,
   playerPaletteSize: 7
};
gameSettings.palette = require('../../data/palettes');

function chooseOpponent(user, body, callback) {

   if (body.user) {
      logger.warn('using a client-supplied opponent, this is for dev purposes only');
      callback(body.user);
   }
   else {

      // get the user list, minus the current user
      //KAI: .lean()?
      User.find( { _id: { $ne: user._id} }, (findErr, list) => {

         if (findErr) {
            callback(null, findErr);
         }
         else {
            if (!list.length) {
               callback(null, 'need more users');
            }
            else {
               callback(list[Math.floor(Math.random() * list.length)]._id);
            }
         }
      });
   }
}
function createGame(players, settings) {
   const totalPlayerColors = players.length * settings.playerPaletteSize;

   logger.info("colors", totalPlayerColors, settings.width, 'x', settings.height);
   logger.assert(players && players.length > 1, 'not enough players');
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
   function addPlayer(p) {
      const player = {
         user: p._id,
         name: p.name,
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
   players.forEach(player => { gameData.players.push(addPlayer(player)); });

   console.log('done creating game');
   return gameData;
}

router.post('/createGame', (req, res, next) => {

   logger.info('createGame', req.url, 'user', req.user.name);

   // find an opponent - look in the request first
   chooseOpponent(req.user, req.body, (opponent, chooseOpponentError) =>{
      logger.info('opponent', opponent);

      if (chooseOpponentError) {
         logger.error('chooseOpponentError', chooseOpponentError);
         return done(err);
      }
      User.findById(opponent, (findErr, opponent) => {
         if (findErr || !opponent) {
            logger.error('findById error ', findErr);
            return res.status(401).end();
         }

         const gameData = createGame([req.user, opponent], gameSettings)
         const newGame = new Game(gameData);
         newGame.save((err, savedGame) => {
            if (err) {
               logger.error('new game creation error', err);
               return done(err);
            }
            res.json({ gameId: newGame._id });

            liveConnection.onGameCreate(savedGame, req.user);
         });
      });
   });
});

module.exports = router;