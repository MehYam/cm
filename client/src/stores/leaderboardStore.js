import { decorate, observable } from 'mobx';

import { colorMatchAPI } from '../util';

class LeaderboardStore {
   leaderboard = [];
   lastError = null;

   async requestLeaders() {
      try {
         const res = await colorMatchAPI('getLeaders');
         console.log('/getLeaders response', res);
         this.leaderboard = res.data.leaders;
      }
      catch(error) {
         console.error('/getLeaders error', error);
         this.lastError = error;
      }
   }
}

decorate(LeaderboardStore, {
   leaderboard: observable,
   lastError: observable
});

export default LeaderboardStore;