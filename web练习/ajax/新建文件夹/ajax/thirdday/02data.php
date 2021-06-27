<?php
//	$arr = array("username"=>"liming","password"=>"456");
//	echo json_encode($arr);//dataType改为json格式


//$tag = '<div>黎明</div>';//dataType改为html
//	echo $tag;

$script = 'alert(123)';//dataType改为script,js代码可以放在数据库，保护密码安全
echo $script;
?>