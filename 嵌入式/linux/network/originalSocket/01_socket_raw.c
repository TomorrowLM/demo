#include <sys/socket.h>
#include <sys/types.h> //socket
#include <netinet/ether.h> //ETH_P_ALL
#include <unistd.h> //close
#include <stdlib.h> //exit
#include <stdio.h> //printf
#include <arpa/inet.h>

int main(int argc, char const *argv[])
{
    //使用socket函数创建链路层的原始套接字
    int sockfd;
    if((sockfd = socket(AF_PACKET, SOCK_RAW, htons(ETH_P_ALL))) == -1)
    {
        perror("fail to sockfd");
        exit(1);
    }

    printf("sockfd = %d\n", sockfd);

    //关闭套接字文件描述符
    close(sockfd);
    
    return 0;
}
