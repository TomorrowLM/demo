var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
// var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var login = require("./routes/login");
var token = require("./routes/token");
var expressJwt = require("express-jwt");
//配置ejs视图的目录
app.set("views", path.join(__dirname, "views")); //views代表存放视图的目录
//启动视图引擎，并指定模板文件文件类型：
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 解决跨域问题
app.all("*", function (req, res, next) {
  //设置请求头
  //允许所有来源访问
  //响应头指定了该响应的资源是否被允许与给定的origin共享。*表示所有域都可以访问，同时可以将*改为指定的url，表示只有指定的url可以访问到资源
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    " Origin, X-Requested-With, Content-Type, Accept,token,Authorization,user, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  //允许访问的方式
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  //修改程序信息与版本
  res.header("X-Powered-By", " 3.2.1");
  //内容类型：如果是post请求必须指定这个属性
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == "OPTIONS") {
    console.log("optio324n")
    res.send(200);
  } else { 
    next(); // 执行下一个路由 
  }
});
//设置托管静态目录; 项目根目录+ public.可直接访问public文件下的文件eg:http://localhost:3000/images/url.jpg
app.use(express.static(path.join(__dirname, "public")));

//验证token是否过期并规定哪些路由不用验证
//不理解请看jwt源码，会在req中添加token解析后的user对象
// {
//   user_name: '1',
//   user_password: '1',
//   iat: 1634103506,
//   exp: 1634319506
// }
app.use(
  expressJwt({
    secret: "zgs_first_token",
    algorithms: ["HS256"],
  }).unless({
    path: ["/login", "users"], //除了这个地址，其他的URL都需要验证
  })
);
//token失效返回信息
// 如果token过期或者 错误的处理
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
    res.status(401).send("非法token");
  }
});
// app.use("/index", indexRouter);
app.use("/users", usersRouter);
app.use("/login", login);
app.use("/token", token);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
