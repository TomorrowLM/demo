#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <string.h>
#include <signal.h>
#include <sys/wait.h>
#include <signal.h>

// 使用多进程实现TCP并发服务器

#define N 128
#define ERR_LOG(errmsg) \
    do                  \
    {                   \
        perror(errmsg); \
        exit(1);        \
    } while (0)

void handler(int sig)
{
    wait(NULL);
}

int main(int argc, char const *argv[])
{
    if (argc < 3)
    {
        fprintf(stderr, "Usage: %s <server_ip> <server_port>\n", argv[0]);
        exit(1);
    }

    int sockfd, acceptfd;
    struct sockaddr_in serveraddr, clientaddr;
    socklen_t addrlen = sizeof(serveraddr);

    // 第一步：创建套接字
    if ((sockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0)
    {
        ERR_LOG("fail to socket");
    }

    // 将套接字设置为允许重复使用本机地址或者为设置为端口复用
    int on = 1;
    if (setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on)) < 0)
    {
        ERR_LOG("fail to setsockopt");
    }

    // 第二步：填充服务器网络信息结构体
    serveraddr.sin_family = AF_INET;
    serveraddr.sin_addr.s_addr = inet_addr(argv[1]);
    serveraddr.sin_port = htons(atoi(argv[2]));

    // 第三步：将套接字与服务器网络信息结构体绑定
    if (bind(sockfd, (struct sockaddr *)&serveraddr, addrlen) < 0)
    {
        ERR_LOG("fail to bind");
    }

    // 第四步：将套接字设置为被动监听状态
    if (listen(sockfd, 5) < 0)
    {
        ERR_LOG("fail to listen");
    }

    // 使用型号，异步的方式处理僵尸进程
    signal(SIGCHLD, handler);

    while (1)
    {
        // 第五步：阻塞等待客户端的连接请求
        if ((acceptfd = accept(sockfd, (struct sockaddr *)&clientaddr, &addrlen)) < 0)
        {
            ERR_LOG("fail to accept");
        }

        // 打印客户端的信息
        printf("%s -- %d\n", inet_ntoa(clientaddr.sin_addr), ntohs(clientaddr.sin_port));

        // 使用fork函数创建子进程，父进程继续负责连接，子进程负责与客户端通信
        pid_t pid;
        if ((pid = fork()) < 0)
        {
            ERR_LOG("fail to fork");
        }
        else if (pid > 0) // 父进程负责执行accept，所以if语句结束后继续在accept函数的位置阻塞
        {
        }
        else // 子进程负责跟指定的客户端通信
        {
            char buf[N] = "";
            ssize_t bytes;
            while (1)
            {
                if ((bytes = recv(acceptfd, buf, N, 0)) < 0)
                {
                    ERR_LOG("fail to recv");
                }
                else if (bytes == 0)
                {
                    printf("The client quited\n");
                    exit(0);
                }

                if (strncmp(buf, "quit", 4) == 0)
                {
                    exit(0);
                }

                printf("from client: %s\n", buf);

                strcat(buf, " ^_^");
                if (send(acceptfd, buf, N, 0) < 0)
                {
                    ERR_LOG("fail to send");
                }
            }
        }
    }

    return 0;
}