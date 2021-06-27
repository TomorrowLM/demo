<?php
$str='hello';
echo $str[0];
$sum=strlen($str);
echo "<br>长度，$sum";
//strstr(str,substr)用于在字符串str中查询子字符串substr首次出现的位置，并截取到最后
//strrchr(str,substr)用于在字符串str中查询子字符串substr最后出现的位置，并截取到最后
//strpos(str,substr)用于在字符串str中查询子字符串substr首次出现的位置
//strrpos(str,substr)
//explode(分隔符,str)指定指定的分隔符，将字符串str进行分割，并将每一部分组织成数组，并返回
//str_replace(search,rep, str);在字符串str中，查找search表示的内容，并替换为rep代表的内容
//strtolower()  strtoupper()大小写转换
//trim(str【,substr】)用于将字符串str两侧的子字符串substr去除。substr可以省略，如果省略表示去除空格。
$first=strstr($str,'l');
echo "<br>$first";

//pathinfo(path【,option】);
//   path 是一个文件路径的字符串
//	用于获取一个文件的路径信息(文件名、文件夹、文件名、扩展名)
//	option参数用于获取路径信息中指定的部分,有dirname,basename,extension,filename
//pathinfo(path,PATHINFO_DIRNAME)

//htmlspecialchars(str)用于将字符串str中的大于号小于号转换为相应的字符实体。<	  &lt;>  &gt;
//htmlspecialchars_decode(str)

//获取数组长度
$arr=array("peter"=>"25","tom"=>"20");
$count=count($arr);
echo $count
//数组指针用于表示当前所关注的有元素。
//  current($arr)		用于当前指针所指向的元素的键值
//  key($arr)			用于当前指针所指向的元素的键名
//  next($arr)			用于将数组的指针下移。
//  prev($arr)			用于将数组的指针上移。
//  reset($arr);			用于将数组的指针重置(归位，数组的指针默认位于第1个元素)。
//  end($arr);			用于将数组的指针移到最后一个元素。

//数组的遍历
//foreach($arr  as  【$key=>】$value){
//		//循环体
//}

//array_keys()获取数组元素所有的键名
//array_values()
//判断键名与键值是否存在array_key_exists(key,arr),in_array(value,arr);
//数组的合并array_merge(数组1,数组2…)

//数组的排序
//sort()对数组按键值进行升序排序
//rsort()
//asort();对数组按键值进行升序排序，但原下标不会变
//arsort()
>