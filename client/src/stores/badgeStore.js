import axios from 'axios';
import auth from '../auth/auth';

import { decorate, observable } from 'mobx';

class BadgeStore {
   badges = {};
   lastError = null;

   requestBadges() {
      axios(
         {
            method: 'GET',
            headers: { Authorization: auth.user.token },
            url: '/api/getBadges',
            data: {}
         }
      )
      .then((res) => {
         console.log('/getBadges response', res);
         this.badges = res.data.badges;
      })
      .catch((error) => {
         console.error('/getBadges error', error);
         this.lastError = error;
      });
   }
}

decorate(BadgeStore, {
   badges: observable,
   lastError: observable
});

export default BadgeStore;