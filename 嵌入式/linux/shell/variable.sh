#!/bin/bash
echo "hello"

echo  `date`

echo ${a}

echo ${shell}

for i in "$*"
#定义for循环，in后面有几个值，for会循环多少次，注意“$*”要用双引号括起来
#每次循环会把in后面的值赋予变量i
#Shell把$*中的所有参数看成是一个整体，所以这个for循环只会循环一次
	do
		echo "The parameters is: $i"
		#打印变量$i的值
	done
x=1
#定义变量x的值为1
for y in "$@"
#同样in后面的有几个值，for循环几次，每次都把值赋予变量y
#可是Shel1中把“$@”中的每个参数都看成是独立的，所以“$@”中有几个参数，就会循环几次
	do
		echo "The parameter$x is: $y"
		#输出变量y的值
		x=$(( $x +1 ))
		#然变量x每次循环都加1，为了输出时看的更清楚
	done


# echo "The current process is $$"
# #输出当前进程的PID.
# #这个PID就是variable.sh这个脚本执行时，生成的进程的PID
# find /root -name hello.sh &
# #使用find命令在root目录下查找hello.sh文件
# #符号&的意思是把命令放入后台执行，工作管理我们在系统管理章节会详细介绍
# echo "The last one Daemon process is $!"
# #输出这个后台执行命令的进程的PID，也就是输出find命令的PID号


read -t 30 -p "Please input your name: " name
#提示“请输入姓名”并等待30 秒，把用户的输入保存入变量name 中
echo "Name is $name"
#看看变量“$name”中是否保存了你的输入