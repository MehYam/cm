const logger = require('../../logger');
const express = require('express');
const router = new express.Router();

router.post('/createGame', (req, res, next) => {

   logger.info('createGame', req.url);

   res.json({
      here: true
   });
});

module.exports = router;