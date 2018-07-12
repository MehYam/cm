import axios from 'axios';
import auth from '../auth/auth';

class GameStore {
   createGame() {
      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/createGame',
            data: {}
         }
      )
      .then((res) => {
         console.log('/createGame response', res);
      })
      .catch((error) => {
         console.error('/createGame error', error);
      });
   }
};

export default GameStore;