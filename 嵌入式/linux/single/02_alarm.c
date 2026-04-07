#include <stdio.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
    unsigned int sec;
    // 当执行到alarm之后，代码会接着往下执行，当设定的时间到后，会产生SIGALRM信号

    // 如果alarm之前没有设置其他闹钟，则返回0，如果之前设置了，则返回之前剩余的秒数
    // 如果一个程序中出现多个alarm闹钟，第一个如果没有到达指定的时间就遇到第二个
    // 则第一个的闹钟时间清除，按照第二个alarm闹钟的时间继续向下运行

    sec = alarm(5);
    printf("sec = %d\n", sec);

    sleep(3);

    sec = alarm(6);
    printf("sec = %d\n", sec);

    while (1)
    {
        printf("hello world\n");
        sleep(1);
    }

    return 0;
}
