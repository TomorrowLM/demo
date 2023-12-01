#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{
    if(mkfifo("myfifo", 0664) == -1)
    {
        if(errno != EEXIST)
        {
            perror("fail to mkfifo");
            exit(1);
        }
    }

    //读写端都存在，只写不读
    //当有名管道的缓冲区写满后，write函数会发生阻塞
    //默认有名管道的缓冲区为64K字节

    int fd;
    if((fd = open("myfifo", O_RDWR)) == -1)
    {
        perror("fail to open");
        exit(1);
    }

    int num = 0;
    while(1)
    {
        write(fd, "", 1024);
        num++;
        printf("num = %d\n", num);
    }

    return 0;
}