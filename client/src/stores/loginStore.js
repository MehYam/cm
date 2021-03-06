import axios from 'axios';
import auth from '../auth/auth';

import { decorate, computed, observable } from 'mobx';

import LiveConnection from '../liveConnection';

function getWebsocketURL() {
   return ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host;   
}
class LoginStore {
   user = null;
   loginError = null;
   registrationError = null;
   liveConnected = false;  //KAI: connecting a mobx computed property that checks this.liveConnection.connected returns null...

   liveConnection = null;

   constructor() {
      this.user = auth.user;
      this.liveConnection = new LiveConnection(connected => this.liveConnected = connected);
   }
   get loggedIn() {
      return this.user !== null;
   }
   logout() {
      auth.clear();

      this.user = null;
      this.loginError = null;
      this.registrationError = null;
      this.liveConnection.disconnect();
   }
   connectLive() {  // KAI: should be private
      if (!this.liveConnection.connected) {
         const wsURL = getWebsocketURL() + '/live'; //KAI: wire this up to the page's root instead
         this.liveConnection.connect(wsURL, auth.user.token); 
      }
   }
   // this will make a raw api call - KAI: if it fails, we should nav our route to the login screen
   testCredentials() {
      if (auth.user) {
         axios({
            method: 'GET',
            headers: { Authorization: auth.user.token },
            url: '/api/ping'
         })
         .then(res => {
            console.log('testCreds success');
            if (!this.liveConnection.connected) {
               this.connectLive();
            }
         })
         .catch(error => {
            console.log('testCreds error', error);
            this.logout();
         })
      }
   }
   requestLogin(name, password) {
      axios.post('/auth/login', { name, password })
      .then(res => {
         console.log('/auth/login response', res);
         console.log('user+token', res.data.user);

         auth.user = res.data.user;
         this.user = auth.user;
         this.loginError = null;

         this.connectLive();
      })
      .catch(error => {
         console.log('/auth/login error', error.response);

         this.logout();
         this.loginError = error.response.data.message;
      })
   }
   modifyingRegistration() {
      // clear out any existing registration error.  This is wonky, but easy, and less wonky than what we had
      this.registrationError = null;
   }
   requestRegistration(name, password) {
      this.logout();

      axios.post('/auth/register', {name, password})
      .then((res) => {
         console.log('/auth/register response', res);

         this.requestLogin(name, password);
      })
      .catch((error) => {
         console.log('/auth/register error', error.response.data);

         auth.clear();
         this.user = null;
         this.registrationError = error.response.data.message;
      })
   }
}

decorate(LoginStore, {
   user: observable,
   loginError: observable,
   registrationError: observable,
   loggedIn: computed,
   liveConnected: observable
});

export default LoginStore;