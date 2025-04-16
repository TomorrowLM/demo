var mysql = require('mysql2');
var mysql_config = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'sqltest',
  port: '3307'
};
var connection = mysql.createConnection(mysql_config);
const handleDisconnection = function () {
  console.log('db执行重连');
  connection = mysql.createConnection(mysql_config);
}
connection.connect(function (err) {
  if (err) {
    console.log('db error执行重连失败:' + err.message);
    setTimeout(handleDisconnection, 2000);
  }
});
connection.on('error', function (err) {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log(err.message)
    handleDisconnection()
  } else {
    throw err;
  }
});

module.exports = connection;