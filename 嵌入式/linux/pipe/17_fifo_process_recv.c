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

    int fd_w, fd_r;
    
    if((fd_r = open("myfifo1", O_RDONLY)) == -1)
    {
        perror("fail to open");
        exit(1);
    }
    
    if((fd_w = open("myfifo2", O_WRONLY)) == -1)
    {
        perror("fail to open");
        exit(1);
    }

    char buf[128] = "";
    ssize_t bytes;
    while(1)
    {
        if((bytes = read(fd_r, buf, sizeof(buf))) == -1)
        {
            perror("fail to read");
            exit(1);
        }

        printf("from send: %s\n", buf);

        fgets(buf, sizeof(buf), stdin);
        buf[strlen(buf) - 1] = '\0';

        write(fd_w, buf, sizeof(buf));
    }

    return 0;
}