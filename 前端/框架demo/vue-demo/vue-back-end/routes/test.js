var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({
    code: 200,
    message: "success",
    name: 1
  });
});

module.exports = router;
