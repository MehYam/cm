const logger = require('./logger');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

app.use(require('morgan')('short', { stream: logger.stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.use('/test', require('./test/test'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   logger.warn('404-ing request', req.url);

   next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

// set up DB connection //////////////////////////////////////////////
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require('./config');
logger.debug("config:", config);
mongoose.connect(config.mongoURL, (error) => {
   if (error) {
      logger.error(`Could not connect to Mongo at ${config.mongoURL}`);
   }
   else {
      logger.info(`Connected to Mongo at ${config.mongoURL}`);
   }
});

module.exports = app;
