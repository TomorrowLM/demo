#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>

int main(int argc, char *argv[])
{
    pid_t pid;

    pid = fork();
    if(pid < 0)
    {
        perror("fail to fork");
        exit(1);
    }
    else if(pid > 0) //父进程的代码区
    {
        printf("This is parent peocess\n");

        //使用pause阻塞等待捕捉信号
        pause();
    }
    else //子进程的代码区 
    {
        printf("This is son process\n");

        sleep(3);

        kill(getppid(), SIGINT);
    }

	return 0;
}

