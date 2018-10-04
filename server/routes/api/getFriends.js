const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

const ModelUtils = require('../../modelUtils');

router.get('/getFriends', async (req, res, next) => {

   logger.info('getFriends');

   const user = req.user;

   try {
      const friends = await ModelUtils.findFriends(user);
      res.send({ friends });
   }
   catch (err) {
      logger.error('getFriends error', err);
      return res.status(400).send(err);
   }
});

module.exports = router;