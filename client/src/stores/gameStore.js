import axios from 'axios';
import auth from '../auth/auth';

import { decorate, observable } from 'mobx';

class GameStore {
   games = [];
   lastError = null;

   createGame() {
      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/createGame',
            data: {
               user: '5b10474ef20ae727305b8226'
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
      })
   }
};

decorate(GameStore, {
   games: observable,
   lastError: observable
});

export default GameStore;