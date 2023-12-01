#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>

int main(void)
{
    //通过dup函数复制一个文件描述符
    int fd;
    //dup执行后给返回值文件描述符分配的值是文件描述符表中最小可用的文件描述符
    fd = dup(1);
    printf("fd = %d\n", fd);
    //由于通过dup函数将1这个文件描述符复制了一份为fd，所以fd现在就相当于1，所以写数据就是想终端写入数据
    write(fd, "nihao beijing\n", strlen("nihao beijing\n"));

    return 0;
}