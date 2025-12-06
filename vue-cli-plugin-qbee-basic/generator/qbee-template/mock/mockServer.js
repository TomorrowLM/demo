/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
var cors = require('cors');
const express = require('express');
const app = express();
app.use(cors({ credentials: true, origin: '*' }));

var commonMock = require('./commonMock');
var testMock = require('./modules/testMock');

testMock.registerMock(app);
commonMock.registerCommonMock(app);

// 监听6308端口
app.listen(6308, function () {
  console.log('server is running');
});
