const ws = require('ws');
const mongoose = require('mongoose');
const logger = require('./logger');

const tokenToUser = require('./routes/auth/tokenToUser');
const User = mongoose.model('User');

const ModelUtils = require('./modelUtils');

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
      logger.info('=-=-=-=-=-=- Initiating LiveConnection server =-=-=-=-=-=-');

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
   }
   onClientClosed(client) {
      logger.debug('LiveConnection removing client', client.id);

      if (client.user) {
         delete this.users[client.user._id];
      }
      delete this.clients[client];
   }

   onUserStatusChange(client) {
      logger.debug('LiveConnection noticed change in user', client.user.name);
      this.broadcastUserStatusChange(client);
   }
   async broadcastUserStatusChange(client) {
      // when a client changes status, loop its friends and send them the updated status
      // KAI: this is a firehose of unnecessary info, could be much more efficient.
      const friends = await ModelUtils.findFriends(client.user);
      for (const friend of friends) {

         const lccFriend = this.users[friend._id];
         if (lccFriend) {
            const friendsFriends = await ModelUtils.findFriends(friend);
            lccFriend.send({ friends: friendsFriends });
         }
      }
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
   async setUserStatus(status) {
      try {
         this.user.status = status;
         await this.user.save();

         this.liveConnection.onUserStatusChange(this);
      }
      catch (err) {
         logger.error('error in LiveConnectionClient.setUserStatus');
      }
   }
   async lookupUser(token) {
      try {
         logger.info('LiveConnectionClient looking up user', token);
         this.user = await tokenToUser(token)
         this.liveConnection.onClientUserEstablished(this);
        
         //KAI: setUserStatus doesn't return anything... does this still work?
         await this.setUserStatus('online');

         // send anything to the client to signal user establishment
         this.send({ welcome: 'hello' });
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
      this.setUserStatus('offline');
   }
   send(payload) {
      if (!this.user) {
         logger.error('trying to send to a non-established LiveConnectionClient');
         return;
      }
      this.websocket.send(JSON.stringify(payload));
   }
}
module.exports = new LiveConnection();