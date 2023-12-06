#include <stdio.h>  //printf
#include <stdlib.h> //exit
#include <sys/types.h>
#include <sys/socket.h> //socket
#include <netinet/in.h> //sockaddr_in
#include <arpa/inet.h>  //htons inet_addr
#include <unistd.h>     //close
#include <string.h>

#define N 128

int main(int argc, char const *argv[])
{
    //./a.out 192.168.3.78 8080
    // if (argc < 3)
    // {
    //     fprintf(stderr, "Usage：%s ip port\n", argv[0]);
    //     exit(1);
    // }
    // printf("%s, %s, %s", argc[0],argc[1],argc[2]);
    // 第一步：创建套接字
    int sockfd;
    if ((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) == -1)
    {
        perror("fail to socket");
        exit(1);
    }

    printf("sockfd = %d\n", sockfd);

    // 第二步：填充服务器网络信息结构体 sockaddr_in
    struct sockaddr_in serveraddr;
    socklen_t addrlen = sizeof(serveraddr);

    serveraddr.sin_family = AF_INET; // 协议族，AF_INET：ipv4网络协议
    serveraddr.sin_addr.s_addr = inet_addr("192.168.110.151"); // ip地址，inet_addr返回32位无符号的整形
    serveraddr.sin_port = htons(8080);//无符号的16位

    // serveraddr.sin_addr.s_addr = inet_addr(argv[1]); // ip地址
    // serveraddr.sin_port = htons(atoi(argv[2]));
    // 第三步：发送数据
    char buf[N] = "";
    while (1)
    {
        fgets(buf, N, stdin);
        buf[strlen(buf) - 1] = '\0'; // 把buf字符串中的\n转化为\0

        if (sendto(sockfd, buf, N, 0, (struct sockaddr *)&serveraddr, addrlen) == -1)
        {
            perror("fail to sendto");
            exit(1);
        }
    }

    // 第四步：关闭套接字文件描述符
    close(sockfd);

    return 0;
}

