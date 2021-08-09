<?php
// 用于处理标题点击事件，自增加点击量
require_once(dirname(dirname(__FILE__)) . '/app.php');
$citycode = $INI['citycode'];
$db = new DB("dz_db");
$gzhsql = " update form_shebaochaxun set sum = sum + 1 where title = '".$_GET['select']."'";
$infotabar=$db::Query($gzhsql);
$db::Close();
?>
