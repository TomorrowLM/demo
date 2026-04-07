#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <signal.h>

void handler(int sig)
{
    printf("SIGINT\n");
}

int main(int argc, char *argv[])
{
    signal(SIGINT, handler);

    // 案例1：
#if 0
    //sleep是一个可重入函数，但是当执行信号处理函数之后，不会回到原本的位置继续睡眠
    //sleep(10);

    //alarm函数是一个可重入函数，当他执行时，如果有信号产生并执行信号处理函数，执行完毕后，会继续运行
    alarm(10);

    while(1)
    {
        printf("hello world\n");
        sleep(1);
    }
#endif

    // 案例2：
#if 1
    char buf[32] = "";

    // read也是一个可重入函数，在等待终端输入时，如果产生信号并执行信号处理函数，信号处理
    // 函数执行完毕后，可以继续输入数据，read可以读取到信号处理函数之后的数据
    if (read(0, buf, 20) == -1)
    {
        perror("fail to read");
        exit(1);
    }

    printf("buf = [%s]\n", buf);
#endif
    return 0;
}