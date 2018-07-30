import axios from 'axios';
import auth from '../auth/auth';

import { decorate, observable } from 'mobx';

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
               //user: '5b554bcf37f6302c303ca4ba'
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
            url: '/api/getGame'
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
};

decorate(GameStore, {
   games: observable,
   currentGame: observable,
   lastError: observable
});

export default GameStore;