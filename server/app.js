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

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   logger.debug("request " + req);

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
