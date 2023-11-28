#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{
    //向文件写入数据
    int fd;
    //以只写的方式打开文件，如果文件不存在则创建，如果文件存在则清空
    fd = open("file.txt", O_WRONLY | O_CREAT | O_TRUNC, 0664);
    if(fd == -1)
    {
        perror("fail to open");
        return -1;
    }

    //使用write函数向文件写入数据
    ssize_t bytes;
    if((bytes = write(fd, "hello world\n", 12)) == -1)
    {
        perror("fail to write");
        return -1;
    }

    printf("bytes = %ld\n", bytes);

    write(fd, "nihao beijing", 5);

    //关闭文件描述符
    close(fd);

    return 0;
}