#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

int main(int argc, char const *argv[])
{
    int pipefd[2];
    if(pipe(pipefd) == -1)
    {
        perror("fail to pipe");
        exit(1);
    }

    write(pipefd[1], "hello world",11);

    //关闭写文件描述符，只有读端
    //如果原本管道中有数据，则读操作正常读取数据
    //如果管道中没有数据，则read函数会返回0
    close(pipefd[1]);

    char buf[128] = "";
    ssize_t bytes;
    if((bytes = read(pipefd[0], buf, sizeof(buf))) == -1)
    {
        perror("fail to read");
        exit(1);
    }

    printf("bytes = %ld\n", bytes);
    printf("buf = %s\n", buf);

    //清除字符串中的内容
    memset(buf, 0, sizeof(buf));

    if((bytes = read(pipefd[0], buf, sizeof(buf))) == -1)
    {
        perror("fail to read");
        exit(1);
    }

    
    printf("bytes = %ld\n", bytes);
    printf("buf = %s\n", buf);

    return 0;
}