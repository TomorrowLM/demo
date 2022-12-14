var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.user)
  res.send({
    code: 200,
    message: 'success',
    data: {
      buttons: {
        'account:authorization:yes': {
          buttonName: "按钮test",
          permission: "account:authorization:yes",
          showVisible: 1,
          available: 1,
        },
        'account:authorization:no': {
          buttonName: "按钮test",
          permission: "account:authorization:no",
          showVisible: 1,
          available: 0,
        },
      },
      menus: [
        {
          menuName: "菜单test",
          route: "/cem-main/experience",
          showVisible: 1,
          available: 1,
        }
      ]
    }
  });
});

module.exports = router;
