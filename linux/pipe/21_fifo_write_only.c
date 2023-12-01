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

    //在一个进程中，只有写端，没有读端
    //会在open函数的位置阻塞

    printf("*****************************\n");

    int fd;
    if((fd = open("myfifo", O_WRONLY)) == -1)
    {
        perror("fail to open");
        exit(1);
    }

    printf("-----------------------------\n");

    while(1)
    {
        write(fd, "hello world", 11);
        printf("666\n");

        sleep(1);
    }

    return 0;
}