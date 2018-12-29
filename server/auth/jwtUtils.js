const jwt = require('jsonwebtoken');

const config = require('../config');
const logger = require('../logger');

const User = require('mongoose').model('User');

async function jwtToUser(token) {

   const t = token.trim();
   const decoded = jwt.verify(t, config.auth.secret);
   const user = await User.findById(decoded.sub);

   return user;
}

function userToJwt(user) {
   const payload = { sub: user._id };
   return jwt.sign(payload, config.auth.secret);
}

function userToClientAuthResponse(user) {
   const token = userToJwt(user);
   const response = {
      displayName: user.displayName,
      id: user._id,
      isAdmin: false,
      isGuest: false,
      token          //KAI: token's not showing up in the client's response header for axios reasons.  Hack it into the response body for now
   };
   return response;
}
module.exports = { jwtToUser, userToJwt, userToClientAuthResponse };