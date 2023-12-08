#include <stdio.h> //printf
#include <stdlib.h> //exit
#include <sys/types.h>
#include <sys/socket.h> //socket
#include <netinet/in.h> //sockaddr_in
#include <arpa/inet.h> //htons inet_addr
#include <unistd.h> //close
#include <string.h>

int main(int argc, char const *argv[])
{
    if(argc < 3)
    {
        fprintf(stderr, "Usage: %s <ip> <port>\n", argv[0]);
        exit(1);
    }

    int sockfd; //文件描述符
    struct sockaddr_in groupcastaddr; //服务器网络信息结构体
    socklen_t addrlen = sizeof(groupcastaddr);

    //第一步：创建套接字
    if((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
    {
        perror("fail to socket");
        exit(1);
    }

    //第二步：填充组播信息结构体
    groupcastaddr.sin_family = AF_INET;
    groupcastaddr.sin_addr.s_addr = inet_addr(argv[1]); //224.x.x.x - 239.x.x.x
    groupcastaddr.sin_port = htons(atoi(argv[2]));

    //第三步：进行通信
    char buf[128] = "";
    while(1)
    {
        fgets(buf, sizeof(buf), stdin);
        buf[strlen(buf) - 1] = '\0';   //"hello\n"-->"hello\0"
 
        if(sendto(sockfd, buf, sizeof(buf), 0, (struct sockaddr *)&groupcastaddr, addrlen) < 0)
        {
            perror("fail to sendto");
            exit(1);
        }
    }

    return 0;
}