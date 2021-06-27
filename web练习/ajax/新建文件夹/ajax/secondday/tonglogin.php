<?php 
header("Content-Type:text/html;charset=utf-8");//防止乱码
$username = $_GET['username'];
$password = $_GET['password'];

// $username = $_POST['username'];
// $password = $_POST['password'];

echo '用户名：'.$username.'密码：'.$password;
//echo 1;

//header("location:./tonglogin.html?flag=1");

?>
