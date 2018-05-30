const logger =  require('../logger');
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {

   logger.debug('test namespace');
   next();

});

router.get('/', (req, res) => {
   logger.debug('test/')
   res.send('test/');
});

router.get('/level1', (req, res, next) => {
   logger.debug('test/level1 intermediate');
   next();
});

router.get('/level1/:therest', (req, res, next) => {
   logger.debug('test/level1 therest =', req.params.therest);
   next();
});

router.get('/level1', (req, res) => {
   logger.debug('test/level1');
   res.send('test/level1');
});

router.get('/level1/level2', (req, res) => {
   logger.debug('test/level1/level2');
   res.send('test/level1/level2');
});
module.exports = router;