#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>

void *ret_handler;

void handler(int sig)
{
    printf("**********************\n");
    printf("nihao beijing\n");
    printf("welcome to 1000phone\n");
    printf("**********************\n");
    printf("%p\n",ret_handler);
    if (signal(SIGINT, ret_handler) == SIG_ERR)
    {
        perror("fail to signal");
        printf("fail to signal");
        exit(1);
    }else{
        printf("fail to signal11");
    }
}

int main(int argc, char const *argv[])
{
    if ((ret_handler = signal(SIGINT, handler)) == SIG_ERR)
    {
        perror("fail to signal");
        exit(1);
    }
    printf("%p\n",ret_handler);
    while (1)
    {
        printf("hello world\n");
        sleep(1);
    }

    return 0;
}