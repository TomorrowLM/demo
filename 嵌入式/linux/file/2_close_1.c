#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{
    int fd;
    fd = open("file.txt", O_RDONLY);

    if (fd == -1)
    {
        perror("fail to open");
        return -1;
    }

    printf("fd = %d\n", fd);

    // 当不对文件进行任何操作时，就会关闭文件描述符
    // 使用close函数关闭文件描述符
    // 一旦关闭了文件描述符，就不能再通过原有的文件描述符对文件进行操作
    close(fd);

    return 0;
}
