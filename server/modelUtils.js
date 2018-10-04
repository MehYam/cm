const mongoose = require('mongoose');
const User = mongoose.model('User');

async function findFriends(user) {
   return await User.find({ _id: { $ne: user._id } }).lean();
}

module.exports = { findFriends };