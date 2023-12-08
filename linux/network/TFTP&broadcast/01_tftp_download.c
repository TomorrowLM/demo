#include <stdio.h> //printf
#include <stdlib.h> //exit
#include <sys/types.h>
#include <sys/socket.h> //socket
#include <netinet/in.h> //sockaddr_in
#include <arpa/inet.h> //htons inet_addr
#include <unistd.h> //close
#include <string.h>
#include <sys/stat.h>
#include <fcntl.h>

void do_download(int sockfd, struct sockaddr_in serveraddr)
{
    char filename[128] = "";
    printf("请输入要下载的文件名: ");
    scanf("%s", filename);

    //给服务器发送消息，告知服务器执行下载操作
    unsigned char text[1024] = "";
    int text_len;
    socklen_t addrlen = sizeof(struct sockaddr_in);
    int fd;
    int flags = 0;
    int num = 0;
    ssize_t bytes;

    //构建给服务器发送的tftp指令并发送给服务器，例如：01test.txt0octet0
    text_len = sprintf(text, "%c%c%s%c%s%c", 0, 1, filename, 0, "octet", 0);
    if(sendto(sockfd, text, text_len, MSG_DONTWAIT, (struct sockaddr *)&serveraddr, addrlen) < 0)
    {
        perror("fail to sendto");
        exit(1);
    }

    while(1)
    {
        //接收服务器发送过来的数据并处理
        if((bytes = recvfrom(sockfd, text, sizeof(text), 0, (struct sockaddr *)&serveraddr, &addrlen)) < 0)
        {
            perror("fail to recvfrom");
            exit(1);
        }

        //printf("操作码：%d, 块编号：%u\n", text[1], ntohs(*(unsigned short *)(text+2)));
        //printf("数据：%s\n", text+4);
        printf("1");
        //判断操作码执行相应的处理
        if(text[1] == 5)
        {
            printf("error: %s\n", text+4);
            return ;
        }
        else if(text[1] == 3)
        {printf("2");
            if(flags == 0)
            {
                //创建文件
                if((fd = open(filename, O_WRONLY | O_CREAT | O_TRUNC, 0664)) < 0)
                {
                    perror("fail to open");
                    exit(1);
                }
                flags = 1;
            }

            //对比编号和接收的数据大小并将文件内容写入文件
            if((num+1 == ntohs(*(unsigned short *)(text+2))) && (bytes == 516))
            {
                num = ntohs(*(unsigned short *)(text+2));
                if(write(fd, text + 4, bytes - 4) < 0)
                {
                    perror("fail to write");
                    exit(1);
                }

                //当文件写入完毕后，给服务器发送ACK
                text[1] = 4;
                if(sendto(sockfd, text, 4, 0, (struct sockaddr *)&serveraddr, addrlen) < 0)
                {
                    perror("fail to sendto");
                    exit(1);
                }
            }
            //当最后一个数据接收完毕后，写入文件后退出函数
            else if((num+1 == ntohs(*(unsigned short *)(text+2))) && (bytes < 516))
            {
                if(write(fd, text + 4, bytes - 4) < 0)
                {
                    perror("fail to write");
                    exit(1);
                }

                text[1] = 4;
                if(sendto(sockfd, text, 4, 0, (struct sockaddr *)&serveraddr, addrlen) < 0)
                {
                    perror("fail to sendto");
                    exit(1);
                }

                printf("文件下载完毕\n");
                return ;
            }
        }
    }
}

int main(int argc, char const *argv[])
{
    if(argc < 2)
    {
        fprintf(stderr, "Usage: %s <server_ip>\n", argv[0]);
        exit(1);
    }

    int sockfd;
    struct sockaddr_in serveraddr;

    //创建套接字
    if((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0)
    {
        perror("fail to socket");
        exit(1);
    }

    //填充服务器网络信息结构体
    serveraddr.sin_family = AF_INET;
    serveraddr.sin_addr.s_addr = inet_addr(argv[1]); //tftp服务器端的ip地址，192.168.3.78
    serveraddr.sin_port = htons(69); //tftp服务器的端口号默认是69

    do_download(sockfd, serveraddr); //下载操作

    return 0;
}