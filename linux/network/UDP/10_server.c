//udp服务器的实现
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
    struct sockaddr_in serveraddr; //服务器网络信息结构体
    socklen_t addrlen = sizeof(serveraddr);

    //第一步：创建套接字
    if((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
    {
        perror("fail to socket");
        exit(1);
    }

    //第二步：填充服务器网络信息结构体
    //inet_addr：将点分十进制字符串ip地址转化为整形数据
    //htons：将主机字节序转化为网络字节序
    //atoi：将数字型字符串转化为整形数据
    serveraddr.sin_family = AF_INET;
    serveraddr.sin_addr.s_addr = inet_addr(argv[1]);
    serveraddr.sin_port = htons(atoi(argv[2]));

    //第三步：将套接字与服务器网络信息结构体绑定
    if(bind(sockfd, (struct sockaddr *)&serveraddr, addrlen) < 0)
    {
        perror("fail to bind");
        exit(1);
    }

    while(1)
    {
        //第四步：进行通信
        char text[32] = "";
        struct sockaddr_in clientaddr;
        if(recvfrom(sockfd, text, sizeof(text), 0, (struct sockaddr *)&clientaddr, &addrlen) < 0)
        {
            perror("fail to recvfrom");
            exit(1);
        }
        printf("[%s - %d]: %s\n", inet_ntoa(clientaddr.sin_addr), ntohs(clientaddr.sin_port), text);
        
        strcat(text, " *_*");

        if(sendto(sockfd, text, sizeof(text), 0, (struct sockaddr *)&clientaddr, addrlen) < 0)
        {
            perror("fail to sendto");
            exit(1);
        }
    }

    //第四步：关闭文件描述符
    close(sockfd);

    return 0;
}