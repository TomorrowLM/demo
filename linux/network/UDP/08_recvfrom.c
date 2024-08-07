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
    // if (argc < 3)
    // {
    //     fprintf(stderr, "Usage: %s ip port\n", argv[0]);
    //     exit(1);
    // }
    printf("%s/n\n", argv[1]);
    // 第一步：创建套接字
    int sockfd;
    if ((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) == -1)
    {
        perror("fail to socket");
        exit(1);
    }

    // 第二步：将服务器的网络信息结构体绑定前进行填充
    struct sockaddr_in serveraddr;
    serveraddr.sin_family = AF_INET;
    serveraddr.sin_addr.s_addr = inet_addr(argv[1]); // 192.168.3.103
    serveraddr.sin_port = htons(atoi(argv[2]));      // 9999

    // 第三步：将网络信息结构体与套接字绑定
    if (bind(sockfd, (struct sockaddr *)&serveraddr, sizeof(serveraddr)) == -1)
    {
        perror("fail to bind");
        exit(1);
    }

    // 接收数据
    char buf[N] = "";
    struct sockaddr_in clientaddr;
    socklen_t addrlen = sizeof(struct sockaddr_in);

    while (1)
    {
        if (recvfrom(sockfd, buf, N, 0, (struct sockaddr *)&clientaddr, &addrlen) == -1)
        {
            perror("fail to recvfrom");
            exit(1);
        }

        // 打印数据
        // 打印客户端的ip地址和端口号
        printf("ip:%s, port:%d\n", inet_ntoa(clientaddr.sin_addr), ntohs(clientaddr.sin_port));
        // 打印接收到数据
        printf("from client: %s\n", buf);
    }

    return 0;
}
