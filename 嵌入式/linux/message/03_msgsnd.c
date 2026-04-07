#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>

#define N 128

typedef struct{
    long msg_type; //消息类型，必须在结构体的第一个位置并且类型必须是long
    char msg_text[N]; //消息正文，也可以有多个成员并且类型也可以是任意
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

    //使用msgsnd函数向消息队列中发送数据（写操作）
    MSG msg1 = {1, "hello world"};
    MSG msg2 = {4, "nihao beijing"};
    MSG msg3 = {2, "hello kitty"};
    MSG msg4 = {3, "welcome to 1000phone"};
    
    if(msgsnd(msgid, &msg1, MSGTEXT_SIZE, 0) == -1)
    {
        perror("fail to msgsnd");
        exit(1);
    }

    if(msgsnd(msgid, &msg2, MSGTEXT_SIZE, 0) == -1)
    {
        perror("fail to msgsnd");
        exit(1);
    }

    if(msgsnd(msgid, &msg3, MSGTEXT_SIZE, 0) == -1)
    {
        perror("fail to msgsnd");
        exit(1);
    }

    if(msgsnd(msgid, &msg4, MSGTEXT_SIZE, 0) == -1)
    {
        perror("fail to msgsnd");
        exit(1);
    }

    system("ipcs -q");


    return 0;
}