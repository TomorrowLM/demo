#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>

int main(int argc, char const *argv[])
{
    //在进程中打开其他文件时，
    //系统会返回文件描述符表中最小可用的文件描述符，
    //并将此文件描述符记录在进程的文件描述符表中。
#if 0
    close(0);

    int fd1, fd2, fd3;
    fd1 = open("file.txt", O_RDONLY | O_CREAT, 0664);
    fd2 = open("file.txt", O_RDONLY | O_CREAT, 0664);
    fd3 = open("file.txt", O_RDONLY | O_CREAT, 0664);

    printf("fd1 = %d\n", fd1);
    printf("fd2 = %d\n", fd2);
    printf("fd3 = %d\n", fd3);
#endif

    //Linux中一个进程最多只能打开NR_OPEN_DEFAULT（即1024）个文件，
    //故当文件不再使用时应及时调用close函数关闭文件
    int fd;
    while(1)
    {
        if((fd = open("file.txt", O_RDONLY | O_CREAT, 0664)) < 0)
        {
            perror("fail to open");
            exit(1);
        }

        printf("fd = %d\n", fd);
    }

    return 0;
}
