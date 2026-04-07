#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

int main(int argc, char const *argv[])
{
    //使用pipe创建一个无名管道
    int fd_pipe[2];
    if(pipe(fd_pipe) == -1)
    {
        perror("fail to pipe");
        exit(1);
    }

    printf("fd_pipe[0] = %d\n", fd_pipe[0]);
    printf("fd_pipe[1] = %d\n", fd_pipe[1]);

    //对无名管道执行读写操作
    //由于无名管道给当前用户进程两个文件描述符，所以只要操作这两个文件
    //描述符就可以操作无名管道，所以通过文件IO中的read和write函数对无名管道进行操作

    //通过write函数向无名管道中写入数据
    //fd_pipe[1]负责执行写操作
    //如果管道中有数据，再次写入的数据会放在之前数据的后面，不会把之前的数据替换
    if(write(fd_pipe[1], "hello world", 11) == -1)
    {
        perror("fail to write");
        exit(1);
    }

    write(fd_pipe[1], "nihao beijing", strlen("nihao beijing")+1);

    //通过read函数从无名管道中读取数据
    //fd_pipe[0]负责执行读操作
    //读取数据时，直接从管道中读取指定个数的数据，如果管道中没有数据了，则read函数会阻塞等待
    char buf[32] = "";
    ssize_t bytes;
    if((bytes = read(fd_pipe[0], buf, 20)) == -1)
    {
        perror("fail to read");
        exit(1);
    }

    printf("buf = [%s]\n", buf);
    printf("bytes = %ld\n", bytes);
    
    bytes = read(fd_pipe[0], buf, sizeof(buf));
    printf("buf = [%s]\n", buf);
    printf("bytes = %ld\n", bytes);

    bytes = read(fd_pipe[0], buf, sizeof(buf));
    printf("buf = [%s]\n", buf);
    printf("bytes = %ld\n", bytes);

    return 0;
}

