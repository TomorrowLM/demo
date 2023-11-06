#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include <sys/types.h>

int main(int argc, char const *argv[])
{
    int num = 0;

    while(1)
    {
        printf("hello world\n");
        sleep(1);
        num++;

        //当循环执行5秒后，进程退出
        if(num == 5)
        {
            //使用raise给当前进程本身发送信号
            raise(SIGALRM);
            //kill(getpid(), SIGALRM);
        }
    }

    return 0;
}