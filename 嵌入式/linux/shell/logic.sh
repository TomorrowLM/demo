#!/bin/bash

#创建目录，判断是否存在，存在就结束，反之创建
echo "当前脚本名称为$0"
DIR=$(pwd)/one
if [ ! -e $DIR ]
then
	mkdir -p $DIR
fi
echo "$DIR 创建成功"

read -p "请输入一个字符，并按Enter确认：" KEY
case "$KEY" in
	[a-z]|[A-Z])
	echo "您输入的是字母"
	;;
	
	[0-9])
	echo "您输入的是数字"
	;;
	
	*)
	echo "您输入的是其他字符"
	;;
esac

#打印时间

for time in morning noon afternoon evening
	do
		echo "This time is $time!"
	done