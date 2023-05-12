var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({
    code: 200,
    message: 'success',
    data: {
      name: 'liming',
      age: '23岁',
    }
  });
});

module.exports = router;
