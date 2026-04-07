#include <stdio.h>
#include <signal.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/types.h>
void handler(int sig);
pid_t  pid;
int main(int argc, char const *argv[])
{
    // 以默认的方式处理信号
#if 0
    if(signal(SIGINT, SIG_DFL) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }
    if(signal(SIGQUIT, SIG_DFL) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }
    if(signal(SIGTSTP, SIG_DFL) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }
#endif

    // 以忽略的方式来处理信号
#if 0
    if(signal(SIGINT, SIG_IGN) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }
    if(signal(SIGQUIT, SIG_IGN) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }
    if(signal(SIGTSTP, SIG_IGN) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }

    //注意：SIGKILL和SIGSTOP这两个信号只能以默认的方式处理，不能忽略或者捕捉
    // if(signal(SIGKILL, SIG_IGN) == SIG_ERR)
    // {
    //     perror("fail to signal");
    //     exit(1);
    // }

#endif

    // 以用户自定义方式处理信号
#if 1
    if (signal(SIGINT, handler) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }
    if (signal(SIGQUIT, handler) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }
    if (signal(SIGTSTP, handler) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }
#endif
    
    pid =getpid();
    printf("%d",pid);
    while (1)
    {
        printf("hello world\n");
        sleep(1);
    }

    return 0;
}

void handler(int sig)
{
    if (sig == SIGINT)
    {
        printf("SIGINT正在处理\n");
        printf("%d\n",pid);
        kill(pid, SIGABRT);
        // kill(getppid(), SIGINT);
        // raise(SIGINT);
        // abort();
    }

    if (sig == SIGQUIT)
    {
        printf("SIGQUIT正在处理\n");
    }

    if (sig == SIGTSTP)
    {
        printf("SIGTSTP正在处理\n");
    }
}