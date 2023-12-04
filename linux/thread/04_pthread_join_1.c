#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

void *thread_fun(void *arg)
{
    printf("子线程正在运行\n");

    sleep(3);

    printf("子线程要退出了\n");
}

int main(int argc, char const *argv[])
{
    printf("主控线程正在执行\n");

    pthread_t thread;

    if(pthread_create(&thread, NULL, thread_fun, NULL) != 0)
    {
        perror("fail to pthread_create");
        exit(1);
    }

    //通过调用pthread_join函数阻塞等待子线程退出
    if(pthread_join(thread, NULL) != 0)
    {
        perror("fail to pthread_join");
        exit(1);
    }

    printf("进程要退出了\n");

    return 0;
}