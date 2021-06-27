<?php
//jsonp 的实现跟 ajax 没有半毛钱关系，jsonp是通过 script的src实现的
$callback = $_GET['_jsonp'];//_jsonp是一个参数（可以是任意的），为得到callback
$arr = array("zs","ls","ww");
//json_encode(),PHP的API，把php对象转化成符合json规范的子符串
echo $callback."(".json_encode($arr).")";// 返回回调函数调用 
?>
