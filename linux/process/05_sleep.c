#include <stdio.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{
    while(1)
    {
        printf("hello world\n");

        //当运行到sleep函数后，程序会在此位置等待设定的秒数，当秒数到大后，代码会接着执行
        //sleep运行时进程为等待态，时间到达后会先切换到就绪态，如果代码继续运行，再切换到运行态
        sleep(2);
    }
    
    return 0;
}
