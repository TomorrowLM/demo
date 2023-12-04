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

    //通过pthread_detach函数将子线程设置为分离态，既不用阻塞，也可以自动回收子线程退出的资源
    if(pthread_detach(thread) != 0)
    {
        perror("fail to pthread_detach");
        exit(1);
    }

    //如果原本子线程是结合态，需要通过pthrad_join函数回收子线程退出的资源，
    //但是这个函数是一个阻塞函数，如果子线程不退出，就会导致当前进程（主控线程）
    //无法继续执行，大大的限制了代码的运行效率
    //如果子线程已经设置为分离态，就不需要再使用pthread_join了
    #if 0
    if(pthread_join(thread, NULL) != 0)
    {
        perror("fail to pthread_join");
        exit(1);
    }
    #endif

    while(1)
    {
        printf("hello world\n");
        sleep(1);
    }

    return 0;
}