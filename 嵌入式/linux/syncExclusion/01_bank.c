#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>

int money = 10000;

void *pthread_fun1(void *arg)
{
    int get, yu, shiji;
    get = 10000;
    
    printf("张三正在查询余额...\n");
    sleep(1);
    yu = money;

    printf("张三正在取钱...\n");
    sleep(1);
    if(get > yu)
    {
        shiji = 0;
    }
    else 
    {
        shiji = get;
        yu = yu - get;
        money = yu;
    }

    printf("张三想取%d元，实际取了%d元，余额为%d元\n", get, shiji, yu);

    pthread_exit(NULL);
}

void *pthread_fun2(void *arg)
{
    int get, yu, shiji;
    get = 10000;
    
    printf("李四正在查询余额...\n");
    sleep(1);
    yu = money;

    printf("李四正在取钱...\n");
    sleep(1);
    if(get > yu)
    {
        shiji = 0;
    }
    else 
    {
        shiji = get;
        yu = yu - get;
        money = yu;
    }

    printf("李四想取%d元，实际取了%d元，余额为%d元\n", get, shiji, yu);

    pthread_exit(NULL);
}

int main(int argc, char const *argv[])
{
    pthread_t thread1, thread2;

    if(pthread_create(&thread1, NULL, pthread_fun1, NULL) != 0)
    {
        perror("fail to pthread_create");
        exit(1);
    }

    if(pthread_create(&thread2, NULL, pthread_fun2, NULL) != 0)
    {
        perror("fail to pthread_create");
        exit(1);
    }

    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);
    
    return 0;
}