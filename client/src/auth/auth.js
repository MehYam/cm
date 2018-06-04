import axios from 'axios';

const tokenKey = 'apiToken';
class auth {
   static set token(t) {
      localStorage.setItem(tokenKey, t);
   }
   static get token() {
      return localStorage.getItem(tokenKey);
   }
   static get loggedIn() {
      return localStorage.getItem(tokenKey) !== null;
   }
   static logout() {
      localStorage.removeItem(tokenKey);
   }
}

export default auth;