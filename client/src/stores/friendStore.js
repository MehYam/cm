import axios from 'axios';
import auth from '../auth/auth';

import { decorate, observable } from 'mobx';

// insert joke about not being able to buy a friend
class FriendStore {
   friends = [];
   lastError = null;

   requestFriends() {
      axios(
         {
            method: 'GET',
            headers: { Authorization: auth.user.token },
            url: '/api/getFriends'
         }
      )
      .then((res) => {
         console.log('/getFriends response', res);
         this.friends = res.data.friends;
      })
      .catch((error) => {
         console.error('/getFriends error', error);
         this.lastError = error;
      });      
   }   
}

decorate(FriendStore, {
   friends: observable,
   lastError: observable
});

export default FriendStore;