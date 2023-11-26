#########################################################################
# File Name     : computer.sh
# Author        : enjoy5512
# mail          : enjoy5512@163.com
# Created Time  : 2023年11月24日 星期五 15时29分58秒
#########################################################################

#!/bin/bash

val=`expr 2 + 2`
echo "两数之和为 : $val"


[ 10 -gt 10 ] 
echo $? 

[ 10 -eq 10 ]
echo $?


#接受用户的输入
read -p '请输入需要查询的用户名:' username

#获取指定用户名在passwd文件中出现的次数
count=$(cat /etc/passwd | grep $username | wc -l)
#count=`cat /etc/passwd | grep $username | wc -l`

#判断出现的次数，如果次数=0则用户不存在，反之存在
if [  $count == 0 ]
then 
		echo '用户不存在'
	else 
		echo '用户存在'
fi

 test -b ./viriable.sh
 echo $?