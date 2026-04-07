#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

void *thread_fun(void *arg)
{
    printf("子线程正在运行\n");

    static char buf[] = "This thread has quited";

    int i;
    for(int i = 0; i < 10; i++)
    {
        if(i == 5)
        {
            //通过pthread_exit函数退出当前线程
            //pthread_exit(NULL);
            pthread_exit(buf);
        }
        printf("*******************\n");
        sleep(1);
    }
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

    //pthread_join(thread, NULL);
    char *str;
    pthread_join(thread, (void **)&str);
    printf("str = %s\n", str);

    printf("进程要退出了\n");

    return 0;
}