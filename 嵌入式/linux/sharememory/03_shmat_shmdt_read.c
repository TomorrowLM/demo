#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/ipc.h>
#include <sys/shm.h>

typedef struct{
    int a;
    char b;
}MSG;

int main(int argc, char const *argv[])
{
    //使用ftok函数获取键值
    key_t mykey;
    if((mykey = ftok(".", 100)) == -1)
    {
        perror("fail to ftok");
        exit(1);
    }

    //通过shmget函数创建或者打开一个共享内存，返回一个共享内存的标识符
    int shmid;
    if((shmid = shmget(mykey, 500, IPC_CREAT | 0666)) == -1)
    {
        perror("fail to shmget");
        exit(1);
    }

    system("ipcs -m");

    //映射共享内存的地址
    //char *text;
    MSG *text;
    if((text = shmat(shmid, NULL, 0)) == (void *)-1)
    {
        perror("fail to shmat");
        exit(1);
    }

    //获取共享内存中的数据
    //printf("text = %s\n", text);
    printf("a = %d, b = %c\n", text->a, text->b);

    //解除共享内存映射
    if(shmdt(text) == -1)
    {
        perror("fail to shmdt");
        exit(1);
    }

    system("ipcs -m");
    
    return 0;
}


