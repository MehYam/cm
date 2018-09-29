const ws = require('ws');
const logger = require('./logger');

class LiveConnection {
   constructor()  {
      logger.debug('instantiating LiveConnection server');
      this.connections = 0;
      this.clients = {};
   }

   //KAI: it would be better if this worked like logger or any of the other imports, which are fully constructed and
   // importable as a fully-constructed singleton by anybody.  This is different, because the http server setup in 
   // 'www' needs to run first before this object is used.  There's probably a nicer solution
   init(server) {
      logger.debug('running LiveConnection server');

      this.websocketServer = new ws.Server({ server });
      this.websocketServer.on('connection', (ws, req) => {
         logger.debug('websocket joined from', req.url);

         const client = new LiveConnectionClient(this, ws, ++this.connections);
         this.clients[client] = this.connections;
      });
      this.websocketServer.on('listening', () => {
         logger.debug('LiveConnection server listening');
      });
      this.websocketServer.on('error', error => {
         //KAI: nuke the instance and try again...?
         logger.error('LiveConnection error', error);
      });
   }

   onClientClosed(client) {
      logger.debug('LiveConnection removing client', client.id);
      delete this.clients[client];
   }
}

class LiveConnectionClient {
   constructor(liveConnection, websocket, id) {
      this.liveConnection = liveConnection;
      this.id = id;

      this.websocket = websocket;
      this.websocket.onmessage = event => {this.onmessage(event)};
      this.websocket.onerror = event => {this.onerror(event)};
      this.websocket.onclose = event => {this.onclose(event)};

      this.received = 0;
   }
   onmessage(event) {
      logger.debug('LiveConnectionClient(%s).onmessage (%s) %s', this.id, ++this.received, event.data);
   }
   onerror(event) {
      logger.error('LiveConnectionClient(%s).onerror', this.id, event);
   }
   onclose(event) {
      logger.debug('LiveConnectionClient(%s).onclose, (msgs, clean, code, reason):', this.id, this.received, event.wasClean, event.code, event.reason);
      this.liveConnection.onClientClosed(this);
   }
}
module.exports = new LiveConnection();