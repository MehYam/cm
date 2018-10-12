const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('./logger');
const createError = require('http-errors');

const app = express();
app.use(require('morgan')('short', { stream: logger.stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false}));//KAI: do we need this?

// some useful Express experimentation
//app.use('/test', require('./test/secure'));
//app.use('/test', require('./test/test'));

// set up DB connection //////////////////////////////////////////////
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require('./config');
mongoose.connect(config.mongoURL, (error) => {
   if (error) {
      logger.error(`Could not connect to Mongo at ${config.mongoURL}`);
   }
   else {
      logger.info(`Connected to Mongo at ${config.mongoURL}`);
   }
});

require('./models/all');

// authentication /////////////////////////////////////////////////////
const passport = require('passport');
app.use(passport.initialize());

passport.use('local-signup', require('./passport/passportRegisterStrategy'));
passport.use('local-signin', require('./passport/passportLoginStrategy'));

app.use('/auth', require('./routes/auth/register'));
app.use('/auth', require('./routes/auth/login'));
app.use('/api', require('./routes/auth/gatekeeper'));

//app.use('/logout', require('./auth/logout'));

// secure api routes
app.use('/api', require('./routes/api/test'));
app.use('/api', require('./routes/api/createGame'));
app.use('/api', require('./routes/api/doMove'));
app.use('/api', require('./routes/api/doVote'));
app.use('/api', require('./routes/api/getBadges'));
app.use('/api', require('./routes/api/getBallot'));
app.use('/api', require('./routes/api/getFriends'));
app.use('/api', require('./routes/api/getGame'));
app.use('/api', require('./routes/api/getGames'));
app.use('/api', require('./routes/api/getLeaders'));

app.get('/api/:call', (req, res) => {
   const response = `api GET '${req.params.call}' passed authorization, but is unimplemented`;
   logger.warn(response);
   res.send(response)
});
app.post('/api/:call', (req, res) => {
   const response = `api POST '${req.params.call}' passed authorization, but is unimplemented`; 
   logger.warn(response);
   res.send(response)
});

// host the client in production, for heroku //////////////////////////
if (process.env.NODE_ENV === 'production') {
  logger.info('hosting client build for Heroku');
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
else {
  app.use('/', require('./routes/index'));
}

// error handlers /////////////////////////////////////////////////////
app.use(function(req, res, next) {
   logger.warn('404-ing request', req.url);

   next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  logger.error(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
