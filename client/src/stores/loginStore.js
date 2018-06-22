import axios from 'axios';
import auth from '../auth/auth';

import { observable, decorate } from 'mobx';

class LoginStore {
   user = null;
   lastError = null;
   
   constructor() {
      this.user = auth.user;
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

         auth.clear();
         this.user = null;
         this.lastError = error;
      })
   }
}

decorate(LoginStore, {
   user: observable,
   lastError: observable
});


export default LoginStore;