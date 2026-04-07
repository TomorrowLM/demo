#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>

#define FIFONAME "fifo_file"

int main(int argc, char const *argv[])
{
    //通过mkfifo函数创建有名管道
    if(mkfifo(FIFONAME, 0664) == -1)
    {
        if(errno != EEXIST)
        {
            perror("fail to mkfifo");
            exit(1);
        }
    }

    //对有名管道进行操作
    //管道后写入的数据会保存在之前写入数据的后面，不会替换
    //如果管道中没有数据了，读操作会阻塞

    //通过open函数打开管道文件并得到文件描述符
    int fd;
    fd = open(FIFONAME, O_RDWR);
    if(fd == -1)
    {
        perror("fail to open");
        exit(1);
    }

    //通过write函数向管道中写入数据
    if(write(fd, "hello world", strlen("hello world")) == -1)
    {
        perror("fail to write");
        exit(1);
    }

    write(fd, "nihao beijing", strlen("nihao beijing"));

    //通过read函数读取管道中的数据
    char buf[32] = "";
    if(read(fd, buf, sizeof(buf)) == -1)
    {
        perror("fail to read");
        exit(1);
    }
    printf("buf = [%s]\n", buf);

    if(read(fd, buf, sizeof(buf)) == -1)
    {
        perror("fail to read");
        exit(1);
    }
    printf("buf = [%s]\n", buf);

    //使用close函数关闭文件描述符
    close(fd);

    return 0;
}