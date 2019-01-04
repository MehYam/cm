// adapted from https://github.com/shouheiyamauchi/react-passport-example/blob/master/server/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../logger');

const userSchema = new mongoose.Schema({
   // profile
   displayName: {type: String, required: true},
   photoUrl: {type: String},

   // auth
   facebookId: {type: String, select: false, index: { unique: true, sparse: true}},
   googleId: {type: String, select: false, index: { unique: true, sparse: true}},

   name: {type: String, select: false, index: { unique: true, sparse: true}},
   password: {type: String, select: false},

   // meta
   created: {type: Date, default: Date.now, required: true},
   isAdmin: {type: Boolean, default: false},
   isGuest: {type: Boolean, default: false},
   isBot: {type: Boolean, default: false},
   lastLoggedIn: {type: Date, default: Date.now},

   // game data
   votesPlaced: {type: Number, default: 0},
   votesReceived: {type: Number, default: 0},

   currentBallot: { type: Array, default: null },

   // LiveConnection
   status: {type: String},
   lastActivity: {type: Object}  // e.g. {date: ..., name: 'viewGame', gameId: ...}, {date: ..., name: 'vote'}, etc
});

userSchema.methods.comparePassword = function comparePassword_this(password, callback) {
   return bcrypt.compare(password, this.password, callback);
};

// pre-save hook to encrypt the password
userSchema.pre('save', function(next) {

   const user = this;
   logger.info('saving user', user.displayName, user.ballot && user.ballot.length);

   if (!user.isModified('password')) { 
      return next(); 
   }

   logger.info('new/modified password field, hashing and salting');
   return bcrypt.genSalt((saltError, salt) => {
      if (saltError) 
      {
         logger.error('getSalt error', saltError);
         return next(saltError); 
      }

      return bcrypt.hash(user.password, salt, (hashError, hash) => {
         if (hashError)
         {
            logger.error('hash error', hashError);
            return next(hashError);
         }

         // store the hashed password
         //KAI: I hate that it works this way
         //KAI: also, is this asynchronous?
         user.password = hash;
         return next();
      });
   });
});

module.exports =  mongoose.model('User', userSchema);
