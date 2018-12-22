const logger = require('./logger');

const mongoose = require('mongoose');
const User = mongoose.model('User');

async function findFriends(user) {
   return await User.find({ _id: { $ne: user._id } }, { currentBallot: 0 }).lean();
}
async function setUserStatus (user, status) {
   const liveConnection = require('./liveConnection');
   try {
      const oldStatus = user.status;
      if (status !== oldStatus) {
         user.status = status;
         await user.save();

         liveConnection.onUserStatusChange(user, oldStatus);
      }
   }
   catch (err) {
      logger.error('error in ModelUtils.setUserStatus', err);
   }
}
async function setUserActivity(user, activity) {
   const liveConnection = require('./liveConnection');
   try {
      const oldActivity = user.lastActivity;
      if (activity != oldActivity) {
         user.lastActivity = activity;
         await user.save();

         liveConnection.onUserChange(user);
      }
   }
   catch(err) {
      logger.error('error in ModelUtils.setUserActivity');
   }
}

module.exports = { findFriends, setUserStatus, setUserActivity };