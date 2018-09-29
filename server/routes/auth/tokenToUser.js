const jwt = require('jsonwebtoken');

const config = require('../../config');
const logger = require('../../logger');

const User = require('mongoose').model('User');

async function tokenToUser(token) {

   const t = token.trim();
   const decoded = jwt.verify(t, config.jwtSecret);
   const user = await User.findById(decoded.sub);

   return user;
}

module.exports = tokenToUser;