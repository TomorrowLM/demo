#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>

int main(int argc, char *argv[])
{
    pid_t pid;

    pid = fork();
    if (pid < 0)
    {
        perror("fail to fork");
        exit(1);
    }
    else if (pid > 0) // 父进程的代码区
    {
        while (1)
        {
            printf("This is parent peocess\n");

            sleep(1);
        }
    }
    else // 子进程的代码区
    {
        printf("This is son process\n");

        // 子进程在3秒之后，让父进程退出
        sleep(3);

        // 使用kill给父进程发送信号，然后父进程接收到信号后直接退出就可以了
        kill(getppid(), SIGINT);
    }

    return 0;
}
