var express = require("express");
var router = express.Router();
//引入token
var vertoken = require("../token/index");
/* user login. */
router.post("/", function (req, res) {
  //获取参数
  const params = [];
  params[0] = req.body.user_name;
  params[1] = req.body.password;
  console.log(21,123)
  res.send({
    code: 1,
    message: "账户或密码不能为空",
  });
  // if (params[0] === "" || params[1] === "") {
  //    res.send({
  //     code: 1,
  //     message: "账户或密码不能为空",
  //   });
  // } else {
  //   if (username === "liming" && password === "123456") {
  //     vertoken
  //       .setToken(result[0].user_name, result[0].user_id)
  //       .then((token) => {
  //         return res.send({
  //           code: 200,
  //           message: "登录成功",
  //           token: token,
  //           //前端获取token后存储在localStroage中,
  //           //**调用接口时 设置axios(ajax)请求头Authorization的格式为`Bearer ` +token
  //         });
  //       });
  //   } else {
  //     return res.json({
  //       code: 200,
  //       message: "登录成功",
  //       token: token,
  //       //前端获取token后存储在localStroage中,
  //       //**调用接口时 设置axios(ajax)请求头Authorization的格式为`Bearer ` +token
  //     });
  //   }
  //   // 查询数据是否存在数据库中(user表没有设置索引)
  //   // connection.query(sqlobj.sqls.login, params, function (err, result) {
  //   //   if (err) {
  //   //     throw err;
  //   //   } else {
  //   //     if (result.length != 0) {
  //   //       console.log(result);
  //   //       //调用生成token的方法
  //   //       vertoken
  //   //         .setToken(result[0].user_name, result[0].user_id)
  //   //         .then((token) => {
  //   //           return res.json({
  //   //             code: 200,
  //   //             message: "登录成功",
  //   //             token: token,
  //   //             //前端获取token后存储在localStroage中,
  //   //             //**调用接口时 设置axios(ajax)请求头Authorization的格式为`Bearer ` +token
  //   //           });
  //   //         });
  //   //     } else {
  //   //       //通过用户名查询
  //   //       let login_params = [req.body.user_name];
  //   //       connection.query(
  //   //         sqlobj.sqls.users,
  //   //         login_params,
  //   //         function (err, data) {
  //   //           if (err) {
  //   //             throw err;
  //   //           } else {
  //   //             if (data.length === 0) {
  //   //               return res.json({
  //   //                 result: 0,
  //   //                 status: 200,
  //   //                 message: "用户不存在",
  //   //               });
  //   //             } else {
  //   //               if (
  //   //                 req.body.user_name === data[0].user_name &&
  //   //                 req.body.password !== data[0].password
  //   //               ) {
  //   //                 return res.json({
  //   //                   result: 0,
  //   //                   status: 200,
  //   //                   message: "密码错误",
  //   //                 });
  //   //               } else if (
  //   //                 req.body.user_name !== data[0].user_name &&
  //   //                 req.body.password === data[0].password
  //   //               ) {
  //   //                 return res.json({
  //   //                   result: 0,
  //   //                   status: 200,
  //   //                   message: "账户名有误",
  //   //                 });
  //   //               } else {
  //   //                 return res.json({
  //   //                   result: 0,
  //   //                   status: 400,
  //   //                   message: "系统错误",
  //   //                 });
  //   //               }
  //   //             }
  //   //           }
  //   //         }
  //   //       );
  //   //     }
  //   //   }
  //   // });
  // }
});

module.exports = router;
