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
      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/createGame',
            data: {
               user: '5b554bcf37f6302c303ca4ba'
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
         this.currentGame = res.data.game;
      })
      .catch((error) => {
         console.error('/getGame error', error);
      });
   }
   applyPendingMove() {
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
      })
      .catch((error) => {
         console.error('/doMove error', error);
      });
   }
   //KAI: 1. these could throw, 2. these belong in a Game object somewhere
   get you() {
      return this.currentGame && this.currentGame.players.find(player => player.you);
   }
   get currentPlayer() {
      if (this.currentGame) {
         const currentPlayerIndex = this.currentGame.moves.length % this.currentGame.players.length;
         return this.currentGame.players[currentPlayerIndex];
      }
      return null;
   }
};

decorate(GameStore, {
   games: observable,
   currentGame: observable,
   pendingMove: observable,
   lastError: observable
});

export default GameStore;