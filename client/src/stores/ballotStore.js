import { decorate, observable } from 'mobx';

import { colorMatchAPI } from '../util';

class BallotStore {
   ballot = [];
   lastError = null;

   async requestBallot() {
      try {
         const res = await colorMatchAPI('getBallot');
         console.log('/getBallot response', res);
         this.ballot = res.data.ballot;
      }
      catch(error) {
         console.error('/getBallot error', error);
         this.lastError = error;
      }
   }
   async vote(index) {
      try {
         this.ballot = [];
         const res = await colorMatchAPI('doVote', { index });
         console.log('/doVote response', res);

         this.requestBallot();
      }
      catch(error) {
         console.error('/doVote error', error);
         this.lastError = error;
      }
   }
}

decorate(BallotStore, {
   ballot: observable,
   lastError: observable
});
export default BallotStore;