#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{
    int pipefd[2];
    if(pipe(pipefd) == -1)
    {
        perror("fail to pipe");
        exit(1);
    }

    //读写端都存在，只读不写
    //如果管道中有数据，会正常读取数据
    //如果管道中没有数据，则读操作会阻塞等待，直到有数据为止

    write(pipefd[1], "hello world", 11);

    char buf[128] = "";
    if(read(pipefd[0], buf, sizeof(buf)) == -1)
    {
        perror("fail to read");
        exit(1);
    }

    printf("buf = %s\n", buf);

    if(read(pipefd[0], buf, sizeof(buf)) == -1)
    {
        perror("fail to read");
        exit(1);
    }

    printf("buf = %s\n", buf);

    return 0;
}