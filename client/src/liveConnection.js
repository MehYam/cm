import rootStore from './stores/rootStore';

export default class LiveConnection {

   socket = null;
   connect(url, token) {
      this.socket = new WebSocket(url);
      this.socket.onopen = event => {
         console.log('LiveConnection.onopen');
         this.send(token);
      };
      this.socket.onmessage = event => {
         console.log('LiveConnection.onmessage', event);

         const json = JSON.parse(event.data);
         if (json.friends) {
            console.log('LiveConnection receiving friends');
            rootStore.friendStore.friends = json.friends;
         }
         else if (json.updatedGame) {
            console.log('LiveConnection receiving game update');

            if (rootStore.gameStore.currentGame && rootStore.gameStore.currentGame._id === json.updatedGame._id) {
               rootStore.gameStore.setCurrentGame(json.updatedGame);
            }
            rootStore.badgeStore.requestBadges();
         }
      }
      this.socket.onclose = event => {
         console.log('LiveConnection.onclose');
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