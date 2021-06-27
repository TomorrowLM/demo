<?php
//使用错误处理机制的好处是，可以将错误记录起来。默认会被记录到apache的/logs/error.log文件中。
//$arr=1;
//if(!is_array($arr)){
//trigger_error('错误处理机制',E_USER_ERROR);
//}

//如果$f变量的值是另一个函数名，那么可以使用这个变量来访问函数
//function show(){
//    return __function__;
//}
//$f='show';
//echo $f();

//JS中的函数可以自调用，但是PHP中的函数没有办法自调用。
//没有名子的函数就是匿名函数(anonymous function)，也称之为闭包函数(closure)。
//php中的匿名函数，可以赋值给一个变量，通过这个变量可以调用匿名函数。还可以用于某个函数的参数。
//$fn = function(){
//echo __function__;
//};
//echo $fn();//closure

//实参传递给形参，形参改变并不影响实参
//在形参前加&符号，将实参与形参之间默认的赋值传值，更改为引用传值（使用同一个地址指针）。
//func_get_args();用于获取实参，并以数组的形式返回。
function showInfo(&$v1,&$v2){
    $v1=100;
    $v2=200;
//    echo $v1,$v2;
    $sum=func_get_args();
    print_r($sum);
}
$a=10;
$b=20;
showInfo($a,$b);
echo "$a,$b";

//PHP语言本身提供了8种数据类型:标量数据类型string integer double bool
//复合数据类型array obj
//特殊数据类型resource资源是PHP内的几个函数所需要的特殊数据类型，由编程人员来分配  null。
//但是在使用手册中我们会遇到另外几中：
//  	mixed		表示类型不确定
//  	callback		表示函数
//  	scalar		如果是int、float、string、bool



?>