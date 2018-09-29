const ws = require('ws');

const logger = require('./logger');
const tokenToUser = require('./routes/auth/tokenToUser');

class LiveConnection {
   constructor()  {
      logger.debug('instantiating LiveConnection server');
      this.connections = 0;
      this.clients = {};
      this.users = {};
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

   onClientUserEstablished(client) {
      logger.debug('LiveConnectionClient user established', client.user.name, client.user._id);
      this.users[client.user._id] = client;

      // send anything to the client to signal user establishment
      client.send('welcome');
   }
   onClientClosed(client) {
      logger.debug('LiveConnection removing client', client.id);

      if (client.user) {
         delete this.users[client.user._id];
      }
      delete this.clients[client];
   }
}

class LiveConnectionClient {
   constructor(liveConnection, websocket, id) {
      this.liveConnection = liveConnection;
      this.id = id;
      this.user = null;

      this.websocket = websocket;
      this.websocket.onmessage = event => {this.onmessage(event)};
      this.websocket.onerror = event => {this.onerror(event)};
      this.websocket.onclose = event => {this.onclose(event)};

      this.received = 0;
   }
   async lookupUser(token) {
      try {
         logger.info('LiveConnectionClient looking up user', token);
         this.user = await tokenToUser(token)
         this.liveConnection.onClientUserEstablished(this);
      }
      catch (err) {
         logger.error('--- DENIED - LiveConnectionClient error in authorization', err);
         this.websocket.close();
      }
   }
   onmessage(event) {
      logger.debug('LiveConnectionClient(%s).onmessage (%s) %s', this.id, ++this.received, event.data);
      if (!this.user) {
         this.lookupUser(event.data);
      }
   }
   onerror(event) {
      logger.error('LiveConnectionClient(%s).onerror', this.id, event);
   }
   onclose(event) {
      logger.debug('LiveConnectionClient(%s).onclose, (msgs, clean, code, reason):', this.id, this.received, event.wasClean, event.code, event.reason);
      this.liveConnection.onClientClosed(this);
   }
   send(payload) {
      if (!this.user) {
         logger.error('trying to send to a non-established LiveConnectionClient');
         return;
      }
      this.websocket.send(payload);
   }
}
module.exports = new LiveConnection();