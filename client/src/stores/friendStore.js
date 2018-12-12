import { decorate, observable } from 'mobx';

import { colorMatchAPI } from '../util';

// insert joke about not being able to buy a friend
class FriendStore {
   friends = [];
   lastError = null;

   async requestFriends() {
      try {
         const res = await colorMatchAPI('getFriends');
         console.log('/getFriends response', res);
         this.friends = res.data.friends;
      }
      catch(error) {
         console.error('/getFriends error', error);
         this.lastError = error;
      }
   }   
}

decorate(FriendStore, {
   friends: observable,
   lastError: observable
});

export default FriendStore;