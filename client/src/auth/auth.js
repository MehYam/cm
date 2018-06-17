// This used to be more, right now it's simply a persistent store for the login state of the Redux store.
// If the login session has expired, the next API call will fail, and the app will revert to the un-logged in state.

const userKey = 'login_v_0_0';
class auth {
   static set user(l) {
      localStorage.setItem(userKey, JSON.stringify(l));
   }
   static get user() {
      const json = localStorage.getItem(userKey);
      return json ? JSON.parse(json) : null;
   }
   static clear() {
      localStorage.removeItem(userKey);
   }
}

export default auth;