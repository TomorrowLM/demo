#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

//由于线程库原本不是系统本身的，所以在链接时需要手动链接库文件 gcc *.c -lpthread

void *thread_fun(void *arg)
{
    printf("子线程正在运行\n");
}

int main(int argc, char const *argv[])
{
    printf("主控线程正在执行\n");

    pthread_t thread;

    //通过pthread_create函数创建子线程
    if(pthread_create(&thread, NULL, thread_fun, NULL) != 0)
    {
        perror("fail to pthread_create");
        exit(1);
    }

    //由于进程结束后，进程中所有的线程都会强制退出，所以现阶段不要让进程退出
    while(1);

    return 0;
}

