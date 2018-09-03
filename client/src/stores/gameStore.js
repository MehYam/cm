import axios from 'axios';
import auth from '../auth/auth';

import { decorate, observable } from 'mobx';


//KAI: think about how to lock down this state and make it more authoritative.  currentGame and 'localGameState' being separate is a little janky,
// might be simpler and better if they were the same object
class GameStore {
   games = [];
   currentGame = null;
   lastError = null;

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

   pendingMove = null;
};

decorate(GameStore, {
   games: observable,
   currentGame: observable,
   pendingMove: observable,
   lastError: observable
});

export default GameStore;