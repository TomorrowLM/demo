<?php
//拼接
    $input="<label for="."exampleInputFile".">姓名</label>";
    $input.="<input type='text' class='form-control'  placeholder='Email'>";
    echo $input;

//decbin()		十进制转换为二进制
//  dechex()		十进制转换为十六进制
//  decoct() 	十进制转换为八进制

//echo/print只能输出标量数据类型，对于任何数据都要转换为字符串输出
//echo 与print的区别：echo没有返回值，print有返回值。

//print_r() 可以输出标量，及复合数据类型。
$arr=array("peter"=>"25","tom"=>"20");
print_r($arr);

//var_dump();主要是用于程序员进行代码调试，可以输出十分详细的信息。并不是为了输出信息给用户。
//$a=1;
//var_dump($a);//输出数据类型（value）

//sprintf();用于格式化输出。
                    //语法：sprint(格式化字符串,变量1,变量2,….)
                    //说明：
                    //	格式化占位符有
                    //	%b			二进制
                    //	%d			十进制
                    //	%o			八进制
                    //	%f			浮点
                    //	%x			十六进制
$v1=255;
echo sprintf('小数:%f',$v1);
?>