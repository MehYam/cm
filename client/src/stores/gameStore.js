import axios from 'axios';
import auth from '../auth/auth';

import { decorate, observable } from 'mobx';


//KAI: think about how to lock down this state and make it more authoritative.  currentGame and 'localGameState' being separate is a little janky,
// might be simpler and better if they were the same object
class GameStore {
   games = [];
   currentGame = null;
   lastError = null;  //KAI: looks like we're not using this anywhere

   pendingMove = null;

   createGame() {
      const testUser = '5b554bcf37f6302c303ca4ba';
      if (testUser) console.warn('starting game with hard-coded test user');

      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/createGame',
            data: {
               user: testUser
            }
         }
      )
      .then((res) => {
         console.log('/createGame response', res);
      })
      .catch((error) => {
         console.error('/createGame error', error);
      });
   }
   requestGames() {
      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/getGames'
         }
      )
      .then((res) => {
         console.log('/getGames response', res);
         this.games = res.data.games;
      })
      .catch((error) => {
         console.error('/getGames error', error);
      });
   }
   requestGame(gameId) {
      this.currentGame = null;
      this.pendingMove = null;
      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/getGame',
            data: {
               game: gameId
            }
         }
      )
      .then((res) => {
         console.log('/getGame response', res);

         // The server's Game is a minimal data structure that stores only the set of events that have occurred,
         // with no redundancy.  Unfold this into a structure that's easier for clients to use.
         this.currentGame = this.hydrateGame(res.data.game);
      })
      .catch((error) => {
         console.error('/getGame error', error);
      });
   }
   acceptPendingMove() {
      //KAI: a whole bunch of state needs to be set up correctly for this to work, assert it or something
      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/doMove',
            data: {
               game: this.currentGame._id,
               paletteIndex: this.pendingMove.paletteIndex,
               row: this.pendingMove.dropCoords.row,
               col: this.pendingMove.dropCoords.col
            }
         }
      )
      .then((res) => {
         console.log('/doMove response', res);

         this.pendingMove = null;
         this.currentGame = this.hydrateGame(res.data.game);
      })
      .catch((error) => {
         console.error('/doMove error', error);
      });
   }
   undoPendingMove() {
      this.pendingMove = null;
   }
   //KAI: could/should share this with server
   hydrateGame(game) {

      // unfold per-player info
      var iPlayer = 0;
      game.players.forEach(player => {
         player.index = iPlayer++;
         player.moves = [];
         player.availablePalette = [];

         player.palette.forEach(color => {
            const used = false;
            player.availablePalette.push({ color, used });
         });

         if (player.you) {
            game.yourPlayer = player;
         }
      });

      game.currentPlayer = game.players[game.moves.length % game.players.length];

      // deduce a board
      game.rows = [];
      for (var r = 0; r < game.height; r++) {
         game.rows.push([]);
      }

      // walk the move events and rebuild the game state
      for (var i = 0; i < game.moves.length; ++i) {
         const move = game.moves[i];
         const player = game.players[i % game.players.length];

         player.moves.push(move);
         player.availablePalette[move.paletteIdx].used = true;

         game.rows[move.y][move.x] = player.palette[move.paletteIdx];
      }

      //KAI: debugging
      window.game = game;

      //KAI: ripe for unit tests here
      return game;
   }
};

decorate(GameStore, {
   games: observable,
   currentGame: observable,
   pendingMove: observable,
   lastError: observable
});

export default GameStore;