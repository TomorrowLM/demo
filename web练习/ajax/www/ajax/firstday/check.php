<?php
response.setContentType("text/json; charset=UTF-8");
$username = $_GET['username'];
$password = $_GET['password'];

if($username == 'admin' && $password == '123'){
	echo 2;
}else{
	echo 1;
}


?>