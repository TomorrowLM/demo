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
    struct sockaddr_in groupcastaddr; 
    socklen_t addrlen = sizeof(groupcastaddr);

    //第一步：创建套接字
    if((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
    {
        perror("fail to socket");
        exit(1);
    }

    //第二步：设置为加入多播组
    struct ip_mreq mreq;
    mreq.imr_multiaddr.s_addr = inet_addr(argv[1]);
    mreq.imr_interface.s_addr = INADDR_ANY;
    if(setsockopt(sockfd, IPPROTO_IP, IP_ADD_MEMBERSHIP, &mreq, sizeof(mreq)) < 0)
    {
        perror("fail to setsockopt");
        exit(1);
    }

    //第三步：填充组播信息结构体
    groupcastaddr.sin_family = AF_INET;
    groupcastaddr.sin_addr.s_addr = inet_addr(argv[1]);  //224.x.x.x - 239.x.x.x
    groupcastaddr.sin_port = htons(atoi(argv[2]));

    //第四步：将套接字与广播信息结构体绑定
    if(bind(sockfd, (struct sockaddr *)&groupcastaddr, addrlen) < 0)
    {
        perror("fail to bind");
        exit(1);
    }

    //第五步：进行通信
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