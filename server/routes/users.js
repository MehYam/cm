var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.json([
      {
         id: 1,
         name: "one"
      },
      {
         id: 2,
         name: "two"
      }
   ]);
});

module.exports = router;
