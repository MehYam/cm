import { decorate, observable } from 'mobx';

import auth from '../auth/auth';
import { colorMatchAPI } from '../util';


//KAI: could/should share this with server
// the Game data type's minimality makes it a little difficult to use (i.e. whose turn is it, who played what, etc).  Here
// we calculate everything so the views don't have to
function hydrateGame(game) {

   // populate per-player info
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
      else {
         game.theirPlayer = player;
      }
   });

   const currentPlayerIndex = game.moves.length % game.players.length;
   game.currentPlayer = game.players[currentPlayerIndex];

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
function hydrateGames(games_raw) {
   const retval = new GamesList();
   games_raw.forEach(raw => {
      const hydrated = hydrateGame(raw);

      if (hydrated.moves.length === (hydrated.width * hydrated.height)) {
         retval.completed.push(hydrated);
      }
      else if (hydrated.currentPlayer._id === hydrated.yourPlayer._id) {
         retval.yourTurn.push(hydrated);
      }
      else {
         retval.theirTurn.push(hydrated);
      }
   });
   return retval;
}

class GamesList {
   yourTurn = [];
   theirTurn = [];
   completed = [];
}

class GameStore {
   games_raw = []; // the response from the server.  We annotate ("hydrate") these games with extra data to make them easier to use
   games = new GamesList();

   currentGame = null;  //KAI: maybe this should be combined with gameCreationState below into a single thing.  The two pieces of state are already coupled.
   gameCreationState = null;
   pendingMove = null;

   //KAI: ditch this.  Have a 'callstate' for each call we make.
   lastError = null;

   async createGame(user) {
      if (this.gameCreationState) {
         throw new Error('trying to create a game while one is pending');
      }

      try { 
         this.gameCreationState = { called: true };

         const res = await colorMatchAPI('createGame', { user });
         console.log('/createGame response', res);
         this.gameCreationState = { result: res.data.gameId };
      }
      catch(error) {
         console.error('/createGame error', error);
         this.lastError = error;
         this.gameCreationState = null;
      }
   }
   async requestGames() {
      try {
         const res = await colorMatchAPI('getGames');
         console.log('getGames response', res);

         this.games_raw = res.data.games;
         this.games = hydrateGames(this.games_raw);
      }
      catch(error) {
         console.error('getGames error', error);
         this.lastError = error;
      }
   }
   async requestGame(gameId) {
      try { 
         this.currentGame = null;
         this.pendingMove = null;

         const res = await colorMatchAPI('getGame', { game: gameId });
         console.log('/getGame response', res);

         // The server's Game is a minimal data structure that stores only the set of events that have occurred,
         // with no redundancy.  Unfold this into a structure that's easier for clients to use.
         this.currentGame = hydrateGame(res.data.game);
      }
      catch(error) {
         console.error('/getGame error', error);
         this.lastError = error;
      }
   }
   async applyPendingMove() {
      //KAI: a whole bunch of state needs to be set up correctly for this to work, assert it as a precondition
      try { 
         const res = await colorMatchAPI('doMove', {
            game: this.currentGame._id,
            paletteIndex: this.pendingMove.paletteIndex,
            row: this.pendingMove.dropCoords.row,
            col: this.pendingMove.dropCoords.col
         });
         console.log('/doMove response', res);

         this.pendingMove = null;
         this.currentGame = hydrateGame(res.data.game);
      }
      catch(error) {
         console.error('/doMove error', error);
         this.lastError = error;
      }
   }
   undoPendingMove() {
      this.pendingMove = null;
   }
   // this is basically a backdoor for handling game updates coming in from LiveConnection, so that we don't have to call
   // requestGames() to fetch the whole batch every time.  Premature optimization maybe, but maybe worth it.
   handleUpdatedGame(updatedGame) {

      // 1. update the raw list with this game, whether it's new or changed
      const foundIndex = this.games_raw.findIndex(game => game._id === updatedGame._id);
      if (foundIndex >= 0) {
         this.games_raw[foundIndex] = updatedGame;
      }
      else {
         this.games_raw.push(updatedGame);
      }

      // 2. process a new hydrated list
      this.games = hydrateGames(this.games_raw);

      // 3. if this is the current game, update it specifically
      if (this.currentGame && this.currentGame._id === updatedGame._id) {
         this.currentGame = hydrateGame(updatedGame);
      }
   }
};

decorate(GameStore, {
   games: observable,
   currentGame: observable,
   gameCreationState: observable,
   pendingMove: observable,
   lastError: observable
});

export default GameStore;