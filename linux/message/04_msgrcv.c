#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>

#define N 128

typedef struct{
    long msg_type;
    char msg_text[N];
}MSG;

#define MSGTEXT_SIZE (sizeof(MSG) - sizeof(long))

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

    system("ipcs -q");

    //通过msgrcv函数接收消息队列中的信息（读操作）
    //注意：如果没有第四个参数指定的消息时，msgrcv函数会阻塞等待
    MSG msg;

    //如果第四个参数为0，则按照先进先出的方式读取数据
    //if(msgrcv(msgid, &msg, MSGTEXT_SIZE, 0, 0) == -1) 
    //如果第四个参数为>0，则获取当前值得消息类型的数据
    //if(msgrcv(msgid, &msg, MSGTEXT_SIZE, 2, 0) == -1)
    //如果第四个参数为<0，则获取当前值得绝对值内消息类型最小的数据
    if(msgrcv(msgid, &msg, MSGTEXT_SIZE, -3, 0) == -1)
    {
        perror("fail to msgrcv");
        exit(1);
    }

    printf("recv_msg = %s\n", msg.msg_text);

    system("ipcs -q");
    
    return 0;
}