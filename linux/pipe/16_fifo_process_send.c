#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

int main(int argc, char const *argv[])
{
    //如果没有创建有名管道，则创建有名管道
    //为了实现两个进程都可以收发数据，所以需要创建两个有名管道
    if(mkfifo("myfifo1", 0664) == -1)
    {
        if(errno != EEXIST)
        {
            perror("fail to mkfifo");
            exit(1);
        }
    }

    if(mkfifo("myfifo2", 0664) == -1)
    {
        if(errno != EEXIST)
        {
            perror("fail to mkfifo");
            exit(1);
        }
    }

    //打开两个有名管道并得到文件描述符
    int fd_w, fd_r;
    if((fd_w = open("myfifo1", O_WRONLY)) == -1)
    {
        perror("fail to open");
        exit(1);
    }

    if((fd_r = open("myfifo2", O_RDONLY)) == -1)
    {
        perror("fail to open");
        exit(1);
    }

    char buf[128] = "";
    ssize_t bytes;
    while(1)
    {
        fgets(buf, sizeof(buf), stdin);
        buf[strlen(buf) - 1] = '\0';

        //send进程负责将数据写入myfifo1，接着从myfifo2中读取数据
        if((bytes = write(fd_w, buf, sizeof(buf))) == -1)
        {
            perror("fail to write");
            exit(1);
        }

        if((bytes = read(fd_r, buf, sizeof(buf))) == -1)
        {
            perror("fail to read");
            exit(1);
        }

        printf("from recv: %s\n", buf);
    }

    return 0;
}