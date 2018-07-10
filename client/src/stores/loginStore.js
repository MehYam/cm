import axios from 'axios';
import auth from '../auth/auth';

import { decorate, computed, observable } from 'mobx';

class LoginStore {
   user = null;
   lastError = null;
   
   constructor() {
      this.user = auth.user;
   }
   get loggedIn() {
      return this.user !== null;
   }
   logout() {
      auth.clear();
      this.user = null;
      this.lastError = null;
   }
   requestLogin(name, password) {
      axios.post('/auth/login', { name, password })
      .then((res) => {
         console.log('/auth/login response', res);
         console.log('user+token', res.data.user);

         auth.user = res.data.user;
         this.user = auth.user;
         this.lastError = null;
      })
      .catch((error) => {
         console.log('/auth/login error', error);

         this.logout();
      })
   }
   requestRegistration(name, password) {
      this.logout();

      axios.post('/auth/register', {name, password})
      .then((res) => {
         console.log('/auth/register response', res);

         this.requestLogin(name, password);
      })
      .catch((error) => {
         console.log('/auth/register error', error);

         auth.clear();
         this.user = null;
         this.lastError = error;
      })
   }
}

decorate(LoginStore, {
   user: observable,
   lastError: observable,
   loggedIn: computed
});


export default LoginStore;