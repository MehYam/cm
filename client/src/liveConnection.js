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
      }
      this.socket.onclose = event => {
         console.log('LiveConnection.onclose');
      }
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