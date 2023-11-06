#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

void myfun()
{
    printf("nihao beijing");

    // 使用return
    // return除了可以返回值以外，在主函数中使用可以退出进程，但是在子函数中使用只能退出当前函数
    // return ;

    // 使用exit
    // exit可以退出一个进程并且可以刷新缓冲区
    exit(0);

    // 使用_exit
    //_exit可以退出一个进程，但是不会刷新缓冲区
    //_exit(0);

    printf("welcome to 1000phone\n");
}

int main(int argc, char const *argv[])
{
    printf("hello world\n");

    myfun();

    printf("hello kitty\n");

    return 0;
}