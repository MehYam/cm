const appRoot = require('app-root-path');
const winston = require('winston');
const timestamp = require('time-stamp');

const formattedTimestamp = () => timestamp('[YYYY-MM-DD HH:mm:ss:ms]');
const options = {
   file: {
      level: 'info',
      timestamp: formattedTimestamp,
      filename: `${appRoot}/server.log`,
      handleExceptions: true,
      json: true,
      maxsize: 4 * 1024 * 1024,
      maxFiles: 4,
      colorize: false
   },
   console: {
      level: 'debug',
      timestamp: formattedTimestamp,
      handleExceptions: true,
      humanReadableUnhandledException: true,      
      json: false,
      colorize: true
   }
};

const logger = new winston.Logger({
   transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
   ],
   exitOnError: false
});

logger.stream = {
   write: (msg, encoding) => { logger.info(msg); }
};

logger.assert = (condition, msg) => {
   if (!condition) {
      logger.error(msg);
   }
}

logger.info('Logging initialized');

module.exports = logger;