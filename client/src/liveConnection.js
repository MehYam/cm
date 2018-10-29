import { toast } from 'react-toastify';

import rootStore from './stores/rootStore';

export default class LiveConnection {

   socket = null;
   received = 0;
   connect(url, token) {
      this.socket = new WebSocket(url);
      this.socket.onopen = event => {
         console.log('LiveConnection.onopen');
         this.send(token);
      };
      this.socket.onmessage = event => {
         ++this.received;

         console.log('LiveConnection.onmessage', event);

         const json = JSON.parse(event.data);
         if (json.friends) {
            console.log('LiveConnection receiving friends');
            rootStore.friendStore.friends = json.friends;

            if (json.change) {
               const change = json.change;
               toast.success(change.friend.name + ' is ' + change.friend.status);
            }
         }
         else if (json.updatedGame) {
            console.log('LiveConnection receiving game update');

            if (json.updatedBy) {
               toast.success(json.updatedBy.name + ' has placed a color');
            }
            rootStore.gameStore.handleUpdatedGame(json.updatedGame);
            rootStore.badgeStore.requestBadges();
         }
         else if (json.createdGame) {
            console.log('LiveConnection receiving new game');
            toast.success(json.createdBy.name + ' has started a new game with you');

            rootStore.gameStore.handleUpdatedGame(json.createdGame);
         }
      }
      this.socket.onclose = event => {
         console.log('LiveConnection.onclose, (msgs: %s, clean: %s, code: %s, reason: %s)', this.received, event.wasClean, event.code, event.reason);
      }
   }
   get connected() {
      return this.socket && this.socket.readyState === 1;      
   }
   send(payload) {
      if (this.socket) {
         if (this.socket.readyState === 1) {
            this.socket.send(payload);
         } else {
            console.error('error, sending while websocket readyState at', this.socket.readyState);
         }
      }
   }
   disconnect() {
      if (this.socket) {
         this.socket.close();
         this.socket = null;
      }
   }
}