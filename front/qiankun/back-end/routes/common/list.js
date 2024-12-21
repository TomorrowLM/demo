const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  console.log(req.cookies.USER)
  const list = [];
  for (let i = 0; i < 10; i++) {
    list.push({
      id: i,
      name: `name${i}`
    });
  }
  console.log(list)
  res.send({
    code: 200,
    message: 'success',
    data: list
  });
});

module.exports = router;
