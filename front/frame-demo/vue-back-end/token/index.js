var jwt = require("jsonwebtoken");
var jwtScrect = "zgs_first_token"; //签名

//登录接口 生成token的方法
var setToken = function (user_name, user_password) {
  return new Promise((resolve, reject) => {
    //expiresln 设置token过期的时间
    const token = jwt.sign(
      { user_name: user_name, user_password: user_password },
      jwtScrect,
      { expiresIn: 60*60*6 }
    );
    resolve(token);
  });
};
//各个接口需要验证token的方法
var getToken = function (token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      console.log("token是空的");
      reject({
        error: "token 是空的",
      });
    } else {
      var info = jwt.verify(token, jwtScrect, (err) => {
        if (err) {
          console.log("invalid");
          return;
        }
        resolve(info); //解析返回的值（sign 传入的值）
      });
    }
  });
};

module.exports = {
  setToken,
  getToken,
};
