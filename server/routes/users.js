const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
   res.json([
      {
         id: 1,
         name: "one"
      },
      {
         id: 2,
         name: "two"
      },
      {
         id: 3,
         name: "three"
      }
   ]);
});

module.exports = router;
