#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <string.h>
#include <pthread.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>

#define N 1024
#define ERR_LOG(errmsg)                                         \
    do                                                          \
    {                                                           \
        perror(errmsg);                                         \
        printf("%s - %s - %d\n", __FILE__, __func__, __LINE__); \
        exit(1);                                                \
    } while (0)

void *pthread_fun(void *arg)
{
    int acceptfd = *(int *)arg;
    char buf[N] = "";
    char head[] = "HTTP/1.1 200 OK\r\n"
                  "Content-Type: text/html\r\n"
                  "\r\n";
    char err[] = "HTTP/1.1 404 Not Found\r\n"
                 "Content-Type: text/html\r\n"
                 "\r\n"
                 "<HTML><BODY>File not found</BODY></HTML>";

    // 接收浏览器通过http协议发送的数据包
    if (recv(acceptfd, buf, N, 0) < 0)
    {
        ERR_LOG("fail to recv");
    }

    printf("*****************************\n\n");
    printf("%s\n", buf);
    // int i;
    // for(i = 0; i < 200; i++)
    // {
    //     printf("[%c] - %d\n", buf[i], buf[i]);
    // }
    printf("\n*****************************\n");

    // 通过获取的数据包中得到浏览器要访问的网页文件名
    // GET /about.html http/1.1
    char filename[128] = "";
    sscanf(buf, "GET /%s", filename); // sscanf函数与空格结束，所以直接可以获取文件名

    if (strncmp(filename, "HTTP/1.1", strlen("http/1.1")) == 0)
    {
        strcpy(filename, "about.html");
    }
    printf("filename = %s\n", filename);

    char path[128] = "./sqlite/";
    strcat(path, filename);

    // 通过解析出来的网页文件名，查找本地中有没有这个文件
    int fd;
    if ((fd = open(path, O_RDONLY)) < 0)
    {
        // 如果文件不存在，则发送不存在对应的指令
        if (errno == ENOENT)
        {
            if (send(acceptfd, err, strlen(err), 0) < 0)
            {
                ERR_LOG("fail to send");
            }

            close(acceptfd);
            pthread_exit(NULL);
        }
        else
        {
            ERR_LOG("fail to open");
        }
    }

    // 如果文件存在，先发送指令告知浏览器
    if (send(acceptfd, head, strlen(head), 0) < 0)
    {
        ERR_LOG("fail to send");
    }

    // 读取网页文件中的内容并发送给浏览器
    ssize_t bytes;
    char text[1024] = "";
    while ((bytes = read(fd, text, 1024)) > 0)
    {
        if (send(acceptfd, text, bytes, 0) < 0)
        {
            ERR_LOG("fail to send");
        }
    }

    pthread_exit(NULL);
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

    while (1)
    {
        // 第五步：阻塞等待客户端的连接请求
        if ((acceptfd = accept(sockfd, (struct sockaddr *)&clientaddr, &addrlen)) < 0)
        {
            ERR_LOG("fail to accept");
        }

        // 打印客户端的信息
        printf("%s -- %d\n", inet_ntoa(clientaddr.sin_addr), ntohs(clientaddr.sin_port));

        // 创建线程接收数据并处理数据
        pthread_t thread;
        if (pthread_create(&thread, NULL, pthread_fun, &acceptfd) != 0)
        {
            ERR_LOG("fail to pthread_create");
        }
        pthread_detach(thread);
    }

    return 0;
}