<?php
header('Access-Control-Allow-Credentials:true');
//setcookie('key','value');
$a=$_COOKIE["user"];
$b=$_COOKIE["pw"];

echo $a+$b;

?>