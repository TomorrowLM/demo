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
    struct sockaddr_in broadcataddr; 
    socklen_t addrlen = sizeof(broadcataddr);

    //第一步：创建套接字
    if((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
    {
        perror("fail to socket");
        exit(1);
    }

    //第二步：填充广播信息结构体
    broadcataddr.sin_family = AF_INET;
    broadcataddr.sin_addr.s_addr = inet_addr(argv[1]); //192.168.3.255 255.255.255.255
    broadcataddr.sin_port = htons(atoi(argv[2]));

    //第三步：将套接字与广播信息结构体绑定
    if(bind(sockfd, (struct sockaddr *)&broadcataddr, addrlen) < 0)
    {
        perror("fail to bind");
        exit(1);
    }

    //第四步：进行通信
    char text[32] = "";
    struct sockaddr_in sendaddr;

    while(1)
    {
        if(recvfrom(sockfd, text, sizeof(text), 0, (struct sockaddr *)&sendaddr, &addrlen) < 0)
        {
            perror("fail to recvfrom");
            exit(1);
        }
        
        printf("[%s - %d]: %s\n", inet_ntoa(sendaddr.sin_addr), ntohs(sendaddr.sin_port), text);
    }

    return 0;
}