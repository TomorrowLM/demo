<?php
//	$arr = array("username"=>"liming","password"=>"456");
//	echo json_encode($arr);//dataType改为json格式
//$tag = '<div>黎明</div>';//dataType改为html
//	echo $tag;
//$script = 'alert(123)';//dataType改为script,js代码可以放在数据库，保护密码安全


//引用传值,使用一个变量a为另一个变量b赋值时，传递的是变量a的地址，这种赋值方式就是引用传值
//$a=10;
//$b=&$a;
//$b=20;

//删除变量
//unset(变量名)；

//isset(v)	用于判断变量是否有设置值(判断变量的值是否为null值)v=null,或者v不存在

//empty(v)	用于判断变量v的值是否为”空”,v=0,'',[],'0',null,0.0,false

//常量定义,define语法可以在分支结构中定义常量，const不允许的。常量在命名时，我们会使用全大写的形式,define定义的常量可以自定义是否区分大小写。
//define('PI',1，true);//不区分大小写
//const D=1;
//if(true){
//    define('PI',3.14);//正确
//    //const PI=3.14错误
//}
//常量的判断及获取所有的常量
//$result=defined('PI');
//$countVar=get_defined_constants();

//魔术常量
//$dir=__dir__;//用于获取当前文件的路径
////双引号定义的字符串中的变量的值可以被解析
//echo "$dir \n 123";

//超级全局变量（预定义变量）
//echo $_SERVER['REMOTE_ADDR'];//127.0.0.1





//强制转化
//(integer)变量		将其他数据类型强制转换为整型
//(float)变量			将其他数据类型强制转换为浮点型
//(array)变量			将其他数据类型强制转换为数组
//(object)变量			将其他数据类型强制转换为对象
//(string)变量			将其他数据类型强制转换为字符串
//(boolean)变量		将其他数据类型强制转换为布尔值
//判断函数的格式的规律：
//is_int(v);


?>