import axios from 'axios';
import auth from '../auth/auth';  //KAI: we should abstract this out into something all api calls go through.  apiCaller.js or something

import { decorate, observable } from 'mobx';

class LeaderboardStore {
   leaderboard = [];
   lastError = null;

   requestLeaders() {
      axios(
         {
            method: 'GET',
            headers: { Authorization: auth.user.token },
            url: '/api/getLeaders',
            data: {}
         }
      )
      .then((res) => {
         console.log('/getLeaders response', res);
         this.leaderboard = res.data.leaders;
      })
      .catch((error) => {
         console.error('/getLeaders error', error);
         this.lastError = error;
      });
   }
}

decorate(LeaderboardStore, {
   leaderboard: observable,
   lastError: observable
});

export default LeaderboardStore;