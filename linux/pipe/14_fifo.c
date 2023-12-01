#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>

int main(int argc, char const *argv[])
{
    //通过mkfifo函数创建有名管道
    if(mkfifo("fifo_file", 0664) == -1)
    {
        //printf("errno = %d\n", errno);
        //如果管道文件已经存在，不需要报错退出，直接使用即可，所以需要在错误输出之前把
        //因为文件存在的错误排除
        if(errno != EEXIST)
        {
            perror("fail to mkfifo");
            exit(1);
        }
    }
    return 0;
}
