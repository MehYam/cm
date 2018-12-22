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
      this.clients = new Set();
      this.userToClient = {};
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
         this.clients.add(client);
      });
      this.websocketServer.on('listening', () => {
         logger.debug('LiveConnection server listening');
      });
      this.websocketServer.on('error', error => {
         //KAI: nuke the instance and try again...?
         logger.error('LiveConnection error', error);
      });

      // heroku times out websockets with no activity after 55 seconds.
      if (process.env.HEROKU_KEEPALIVE_SECONDS) {
         const interval = Math.max(10, parseInt(process.env.HEROKU_KEEPALIVE_SECONDS)) * 1000;

         logger.info('LiveConnection creating ad-hoc keepalive interval', interval)
         setInterval(() => {
            for (const client of this.clients) {
               client.send({msg: 'staywithus'});
            }
         }, interval);
      }
   }

   onClientUserEstablished(client) {
      logger.debug('LiveConnectionClient user established', client.user.name, client.user._id);
      this.userToClient[client.user._id] = client;
   }
   onClientClosed(client) {
      logger.debug('LiveConnection removing client', client.id);

      if (client.user) {
         delete this.userToClient[client.user._id];
      }
      this.clients.delete(client);
   }

   onUserStatusChange(user, oldStatus) {
      logger.debug('LiveConnection handling change in user %s from %s to %s', user.name, oldStatus, user.status);

      this.broadcastUserChangeToFriends(user, { friend: user, oldStatus });
   }
   onUserChange(user) {
      this.broadcastUserChangeToFriends(user, { friend: user });
   }
   async broadcastUserChangeToFriends(user, change) {
      // when a client changes status, loop its friends and send them the updated status
      const friends = await ModelUtils.findFriends(user);
      for (const friend of friends) {

         const liveFriend = this.userToClient[friend._id];
         if (liveFriend) {
            /*
            Use this to send the entire friends list.  Requires an extra call for info the client already has, so not really worth it

            const friendsFriends = await ModelUtils.findFriends(friend);
            liveFriend.send({ 
               friends: friendsFriends,
               change: {
                  friend: client.user,
                  oldStatus
               }
            });
            */
            liveFriend.send(change);
         }
      }
   }
   onGameCreate(game, user) {
      logger.debug('LiveConnection noticed new game', game._id);
      for (const player of game.players) {
         if (String(player.user) !== String(user._id)) {
            const lccPlayer = this.userToClient[player.user];
            if (lccPlayer) {
               logger.debug('sending created game');
               lccPlayer.send({ createdGame: game, createdBy: user });
            }
         }
      }
   }
   //KAI: copy pasta with above
   onGameChange(game, user) {
      // notify the other players in this game that it's changed
      logger.debug('LiveConnection noticed a change in game', game._id);
      for (const player of game.players) {
         if (String(player.user) !== String(user._id)) {
            // just send the game to the other player
            // KAI: firehosing again
            const lccPlayer = this.userToClient[player.user];
            if (lccPlayer) {
               logger.debug('sending move');
               lccPlayer.send({ updatedGame: game, updatedBy: user });
            }
         }
      }
   }
}

//KAI: not really sure this class has a purpose
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
   async resolveUser(token) {
      try {
         logger.info('LiveConnectionClient looking up user', token);
         this.user = await tokenToUser(token)
         this.liveConnection.onClientUserEstablished(this);
   
         await ModelUtils.setUserStatus(this.user, 'online');

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
         // first message back must be client's API token, to authenticate the live connection
         this.resolveUser(event.data);
      }
   }
   onerror(event) {
      logger.error('LiveConnectionClient(%s).onerror', this.id, event);
   }
   onclose(event) {
      logger.debug('LiveConnectionClient(%s).onclose, (msgs: %s, clean: %s, code: %s, reason: %s)', this.id, this.received, event.wasClean, event.code, event.reason);
      this.liveConnection.onClientClosed(this);

      if (this.user) {
         ModelUtils.setUserStatus(this.user, 'offline');
      }
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