#include <stdio.h>
#include <stdlib.h>

int main(int argc, char const *argv[])
{
    //使用system执行shell命令
    system("clear");

    system("ls -l");

    system("./hello");

    system("./myshell.sh");

    return 0;
}