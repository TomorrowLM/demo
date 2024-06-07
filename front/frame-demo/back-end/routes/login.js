var express = require("express");
var router = express.Router();
//引入token
var vertoken = require("../token/index");
/* user login. */
router.post("/", function (req, res) {
  //获取参数
  const params = [];
  params[0] = req.body.username;
  params[1] = req.body.password;
  console.log(params[0]);
  if (!params[0] || !params[1]) {
    return res.send({
      code: -1,
      message: "账户或密码不能为空",
    });
  } else {
    if (params[0] === "liming" && params[1] === "1") {
      vertoken.setToken(params[0], params[1]).then(
        (token) => {
          return res.send({
            code: 200,
            message: "登录成功",
            token: token,
            //前端获取token后存储在localStroage中,
            //**调用接口时 设置axios(ajax)请求头Authorization的格式为`Bearer ` +token
          });
        },
        (error) => {
          console.log(123)
          return res.send({
            code: 200,
            message: "登录失败",
            token: token,
            //前端获取token后存储在localStroage中,
            //**调用接口时 设置axios(ajax)请求头Authorization的格式为`Bearer ` +token
          });
        }
      )
    } else {
      res.status(401).send("账号或者密码错误");
    }
  }
});

module.exports = router;
