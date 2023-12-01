#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>

void handler(int sig)
{
    printf("SIGPIPE信号产生了，管道破裂了\n");
}

int main(int argc, char const *argv[])
{
    signal(SIGPIPE, handler);

    int pipefd[2];
    if(pipe(pipefd) == -1)
    {
        perror("fail to pipe");
        exit(1);
    }

    //关闭写操作文件描述符，只有写端
    //如果关闭读端，一旦执行写操作，就会产生一个信号SIGPIPE（管道破裂），
    //这个信号的默认处理方式是退出进程
    close(pipefd[0]);

    int num = 0;
    while(1)
    {
        if(write(pipefd[1], "hello world", 11) == -1)
        {
            perror("fail to write");
            exit(1);
        }
        num++;
        printf("num = %d\n", num);
    }

    return 0;
}