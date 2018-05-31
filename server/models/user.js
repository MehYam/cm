// adapted from https://github.com/shouheiyamauchi/react-passport-example/blob/master/server/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../logger');

const userSchema = new mongoose.Schema({
   name: {type: String, required: true, index: { unique: true}},
   password: {type: String, required: true},
   created: {type: Date, default: Date.now, required: true}
});

userSchema.methods.comparePassword = function comparePassword_this(password, callback) {
   logger.info("bcrypt.compare", this.password, password);
   return bcrypt.compare(password, this.password, callback);
};

// pre-save hook to encrypt the password
userSchema.pre('save', function(next) {

   const user = this;
   logger.info('registering user', user.name);

   if (!user.isModified('password')) { 
      return next(); 
   }

   logger.info('hashing and salting');
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
