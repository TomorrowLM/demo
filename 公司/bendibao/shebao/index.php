<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');
require_once(dirname(dirname(__FILE__)) . '/include/library/Utility.class.php');

$url = 'http://adminhswbdb.sz.bendibao.com/admin_bdbinfo88/get_bsyinfolist.php?';
//最新动态
$select = 'classid=8516&n=4';
$bsyDataArr = Utility::GetHttpData($url,$select);
$select = 'classid=129&n=4';
$bsyDataArr = array_merge($bsyDataArr,Utility::GetHttpData($url,$select));
//热点推荐
$select = 'n=8';
$hotDataArr = Utility::GetHttpData($url,$select);
//常见问答
$select = 'classid=130&n=8';
$askDataArr = Utility::GetHttpData($url,$select);

//查询列表
$citycode = $INI['citycode'];
$db = new DB("dz_db");
$gzhsql = "select title,url,block,sum from form_shebaochaxun order by sum desc";
$infotabar=$db::GetQueryResult($gzhsql,false,1);
$db::Close();
include template('shebao/index');
?>