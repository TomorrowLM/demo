#include <stdio.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <stdlib.h>

int main(int argc, char const *argv[])
{
    //使用socket函数创建套接字
    //创建一个用于UDP网络编程的套接字
    int sockfd;
    if((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) == -1)
    {
        perror("fail to socket");
        exit(1);
    }

    printf("sockfd = %d\n", sockfd);//3,012已经占用

    return 0;
}


