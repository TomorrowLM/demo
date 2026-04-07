#include <stdio.h>
// #include <sys/types.h>
// #include <sys/stat.h>
#include <fcntl.h>
// #include <errno.h>

int main(int argc, char const *argv[])
{
    // 使用open函数打开或者创建一个文件
    int fd;
    fd = open("file.txt", O_RDONLY);

    if (fd == -1)
    {
        // 通过全局变量errno打印错误码
        // 注意需要添加头文件errno.h
        // printf("errno = %d\n", errno);

        // 通过perror函数输出函数调用失败的错误信息
        perror("fail to open");
        return -1;
    }

    printf("fd = %d\n", fd);

    return 0;
}
