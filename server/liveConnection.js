const ws = require('ws');
const logger = require('./logger');

class LiveConnection {
   constructor()  {
      logger.debug('instantiating LiveConnection server');
   }

   //KAI: it would be better if this worked like logger or any of the other imports, which are fully constructed and
   // importable as a fully-constructed singleton by anybody.  This is different, because the http server setup in 
   // 'www' needs to run first before this object is used.  There's probably a nicer solution
   init(server) {
      logger.debug('running LiveConnection server');

      this.websocketServer = new ws.Server({ server });
      this.websocketServer.on('connection', (ws, req) => {

         logger.debug('websocket joined from', req.url);
         let receivedMsgs = 0;
         ws.onmessage = event => {
            logger.debug('ws.onmessage', event.data, ++receivedMsgs);
            ws.send('welcome');
         };
         ws.onerror = event => {
            logger.error('ws.onerror', event);
         };
         ws.onclose = event => {
            logger.debug('ws.onclose, (msgs, clean, code, reason):', receivedMsgs, event.wasClean, event.code, event.reason);
         }
      });
      this.websocketServer.on('listening', () => {
         logger.debug('LiveConnection server listening');
      });
      this.websocketServer.on('error', error => {
         logger.error('LiveConnection error', error);
      });

   }
}

module.exports = new LiveConnection();