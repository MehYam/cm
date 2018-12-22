import { toast } from 'react-toastify';

import rootStore from './stores/rootStore';

export default class LiveConnection {

   socket = null;
   received = 0;
   connectedCallback = null;
   constructor(connectedCallback) {
      this.connectedCallback = connectedCallback;
   }
   connect(url, token, connectedCallback) {
      this.socket = new WebSocket(url);
      this.socket.onopen = event => {
         console.log('LiveConnection.onopen');
         this.send(token);

         if (this.connectedCallback) {
            this.connectedCallback(true);
         }
      };
      this.socket.onmessage = event => {
         ++this.received;

         console.log('LiveConnection.onmessage', event);

         const json = JSON.parse(event.data);
         if (json.friends) {
            // this is deprecated, the server will only send the singlely updated friend
            console.log('LiveConnection receiving updated friends');
            rootStore.friendStore.friends = json.friends;

            if (json.change) {
               const change = json.change;
               toast.success(change.friend.name + ' is ' + change.friend.status);
            }
         }
         else if (json.friend) {
            console.log('LiveConnection receiving one updated friend ', json.friend);
            rootStore.friendStore.handleUpdatedFriend(json.friend);

            if (json.oldStatus) {
               toast.success(`${json.friend.name} is ${json.friend.status}`);
            }
         }
         else if (json.updatedGame) {
            console.log('LiveConnection receiving game update');

            if (json.updatedBy) {
               //KAI: bad
               const completed = json.updatedGame.moves.length === (json.updatedGame.width * json.updatedGame.height);
               const status = completed ? ' has completed a game' : ' has played a turn';
               toast.success(json.updatedBy.name + status);
            }
            rootStore.gameStore.handleUpdatedGame(json.updatedGame);
         }
         else if (json.createdGame) {
            console.log('LiveConnection receiving new game');
            toast.success(json.createdBy.name + ' has started a new game with you');

            rootStore.gameStore.handleUpdatedGame(json.createdGame);
         }
      }
      this.socket.onclose = event => {
         console.log('LiveConnection.onclose, (msgs: %s, clean: %s, code: %s, reason: %s)', this.received, event.wasClean, event.code, event.reason);
         if (this.connectedCallback) {
            this.connectedCallback(false);
         }
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