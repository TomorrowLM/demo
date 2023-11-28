#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

#define N 64

int main(int argc, char const *argv[])
{
    // 使用read从文件中读取数据
    int fd;
    if ((fd = open("test.txt", O_RDONLY | O_CREAT, 0664)) == -1)
    {
        perror("fail to open");
        return -1;
    }

    // 读取文件内容
    char buf[N] = "";
    ssize_t bytes;
#if 1
    if ((bytes = read(fd, buf, 32)) == -1)
    {
        perror("fail to read");
        return -1;
    }

    printf("buf = [%s]\n", buf);
    printf("bytes = %ld\n", bytes);

    char buf1[N] = "";
    bytes = read(fd, buf1, 32);
    printf("buf1 = [%s]\n", buf1);
    printf("bytes = %ld\n", bytes);

    // 如果文件中的数据都读取完毕，则read会返回0
    char buf2[N] = "";
    bytes = read(fd, buf2, 32);
    printf("buf2 = [%s]\n", buf2);
    printf("bytes = %ld\n", bytes);
#endif

#if 0
    //读取文件中的所有内容
    while((bytes = read(fd, buf, 32)) != 0)
    {
        printf("buf = [%s]\n", buf);
        printf("bytes = %ld\n", bytes);
    }
#endif
    // 关闭文件描述符
    close(fd);

    return 0;
}