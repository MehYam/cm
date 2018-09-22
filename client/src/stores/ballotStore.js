import axios from 'axios';
import auth from '../auth/auth';

import { decorate, observable } from 'mobx';

class BallotStore {
   ballot = [];
   lastError = null;

   requestBallot() {
      axios(
         {
            method: 'GET',
            headers: { Authorization: auth.user.token },
            url: '/api/getBallot',
            data: {}
         }
      )
      .then((res) => {
         console.log('/getBallot response', res);

         this.ballot = res.data.ballot;
      })
      .catch((error) => {
         console.error('/getBallot error', error);
         this.lastError = error;
      });
   }
   vote(index) {
      this.ballot = [];
      axios(
         {
            method: 'POST',
            headers: { Authorization: auth.user.token },
            url: '/api/doVote',
            data: { index }
         }
      )
      .then((res) => {
         console.log('/doVote response', res);
      })
      .catch((error) => {
         console.error('/doVote error', error);
         this.lastError = error;
      });
   }
}

decorate(BallotStore, {
   ballot: observable,
   lastError: observable
});
export default BallotStore;