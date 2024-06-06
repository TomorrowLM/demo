var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({
    code: 200,
    message: "success",
    name: 'liming'
  });
});

module.exports = router;
