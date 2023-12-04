#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

//一个进程中的多个线程执行顺序是不确定的，没有先后顺序可言
//多线程执行时跟进程一样，是来回切换运行的，跟进程的调度机制一样

void *pthread_fun1(void *arg)
{
    printf("子线程1正在运行\n");
    sleep(1);
    printf("**********************\n");
}

void *pthread_fun2(void *arg)
{
    printf("子线程2正在运行\n");
    sleep(1);
    printf("-----------------------\n");
}

int main(int argc, char const *argv[])
{
    pthread_t thread1, thread2;

    if(pthread_create(&thread1, NULL, pthread_fun1, NULL) != 0)
    {
        perror("fail to pthread_create");
    }

    if(pthread_create(&thread2, NULL, pthread_fun2, NULL) != 0)
    {
        perror("fail to pthread_create");
    }

    while(1);

    return 0;
}