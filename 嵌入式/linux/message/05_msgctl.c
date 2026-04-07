#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>

int main(int argc, char const *argv[])
{
    //使用ftok函数获取键值
    key_t key;
    if((key = ftok(".", 100)) == -1)
    {
        perror("fail to ftok");
        exit(1);
    }

    //使用msgget函数创建一个消息队列
    int msgid;
    if((msgid = msgget(key, IPC_CREAT | 0777)) == -1)
    {
        perror("fail to msgget");
        exit(1);
    }

    printf("msgid = %d\n", msgid);
    system("ipcs -q");

    //通过msgctl函数删除消息队列
    if(msgctl(msgid, IPC_RMID, NULL) == -1)
    {
        perror("fail to msgctl");
        exit(1);
    }

    system("ipcs -q");
    
    return 0;
}