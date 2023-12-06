#include <stdio.h>
#include <arpa/inet.h>
int main()
{
	char ip_str[]="192.168.3.103";
	unsigned int ip_int = 0;
	unsigned char *ip_p = NULL;

	//将点分十进制ip地址转化为32位无符号整形数据
	inet_pton(AF_INET,ip_str,&ip_int);

	printf("ip_int = %d\n",ip_int);
	
	ip_p = (char *)&ip_int;
	printf("in_uint = %d,%d,%d,%d\n",*ip_p,*(ip_p+1),*(ip_p+2),*(ip_p+3));

	return 0;
}

