const ws = require('ws');
const logger = require('./logger');

class LiveConnection {
   constructor(server)  {
      logger.debug('opening LiveConnection server');

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

module.exports = LiveConnection;