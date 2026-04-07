#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/ipc.h>
#include <sys/shm.h>

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

    printf("shmid = %d\n", shmid);

    system("ipcs -m");

    //通过shmctl函数删除共享内存
    if(shmctl(shmid, IPC_RMID, NULL) == -1)
    {
        perror("fail to shmctl");
        exit(1);
    }

    system("ipcs -m");
    
    return 0;
}