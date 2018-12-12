import { decorate, observable } from 'mobx';

import { colorMatchAPI } from '../util';

class BadgeStore {
   badges = {};
   lastError = null;

   requestBadges() {
      try {
         const res = colorMatchAPI('getBadges');
         console.log('/getBadges response', res);
         this.badges = res.data.badges;
      }
      catch(error) {
         console.error('/getBadges error', error);
         this.lastError = error;
      }
   }
}

decorate(BadgeStore, {
   badges: observable,
   lastError: observable
});

export default BadgeStore;