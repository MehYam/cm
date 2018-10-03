const logger = require('../../logger');
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');

const User = mongoose.model('User');

router.get('/getFriends', async (req, res, next) => {

   logger.info('getFriends');

   const user = req.user;

   try {
      const friends = await User.find({ _id: { $ne: user._id } }).lean();
      res.send({ friends });
   }
   catch (err) {
      logger.error('getFriends error', err);
      return res.status(400).send(err);
   }
});

module.exports = router;