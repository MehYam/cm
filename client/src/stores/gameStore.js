import axios from 'axios';
import auth from '../auth/auth';

import { decorate, observable } from 'mobx';

class GameStore {
   games = [];
   currentGame = null;  //KAI: maybe this should be combined with pendingCreateGame below into a single thing.  The two pieces of state are already coupled.

   pendingCreateGame = null;

   lastError = null;  //KAI: we need to start handling this everywhere

   pendingMove = null;

   //KAI: replace with setter, would have already but not sure about mobx and getter/setter observers.
   setCurrentGame(game) {
      this.currentGame = this.hydrateGame(game);
   }
   createGame(user) {
      if (this.pendingCreateGame) {
         throw new Error('trying to create a game while one is pending');
      }

      this.pendingCreateGame = { called: true };
      const data = { user };
      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/createGame',
            data 
         }
      )
      .then((res) => {
         console.log('/createGame response', res);
         this.pendingCreateGame = { result: res.data.gameId };
      })
      .catch((error) => {
         console.error('/createGame error', error);
         this.lastError = error;
         this.pendingCreateGame = null;
      });
   }
   requestGames() {
      axios(
         {
            method: 'GET',
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
         this.lastError = error;
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
         this.setCurrentGame(res.data.game);
      })
      .catch((error) => {
         console.error('/getGame error', error);
         this.lastError = error;
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
         this.setCurrentGame(res.data.game);
      })
      .catch((error) => {
         console.error('/doMove error', error);
         this.lastError = error;
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

         if (player.user === auth.user.id) {
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
   pendingCreateGame: observable,
   pendingMove: observable,
   lastError: observable
});

export default GameStore;