#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

void *pthread_fun(void *arg)
{
    while(1)
    {
        printf("子线程正在运行\n");

        sleep(1);
    }
}

int main(int argc, char const *argv[])
{
    pthread_t thread;

    if(pthread_create(&thread, NULL, pthread_fun, NULL) != 0)
    {
        perror("fail to pthread_create");
    }

    //通过调用pthread_cancel函数取消另一个线程
    sleep(3);
    pthread_cancel(thread);

    // pthread_join(thread, NULL);

    return 0;
}