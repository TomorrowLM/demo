#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

void *pthread_fun(void *arg)
{
    pthread_setcancelstate(PTHREAD_CANCEL_ENABLE, NULL);

    //设置线程取消的类型
    //设置为立即取消
    //pthread_setcanceltype(PTHREAD_CANCEL_ASYNCHRONOUS, NULL);
    //设置为不立即取消
    pthread_setcanceltype(PTHREAD_CANCEL_DEFERRED, NULL);
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

    sleep(3);
    pthread_cancel(thread);

    pthread_join(thread, NULL);

    return 0;
}