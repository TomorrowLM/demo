#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{

    //测试一个进程（一个程序的运行）创建的文件描述符的个数
    //一个程序运行的时候最多可以创建2014个文件描述符，0~1023
#if 0
    int fd;
    while (1)
    {
        fd = open("file.txt", O_RDONLY | O_CREAT, 0664);

        if(fd == -1)
        {
            perror("fail to open");
            return -1;
        }

        printf("fd = %d\n", fd);
    }
#endif

    //测试文件描述符值的规律
    //文件描述符按照从小到大的顺序依次创建
    //如果中途有文件描述符被关闭了，则再创建的
    //文件描述符会先补齐之前的，然后依次递增创建
    //注意：不要认为最后创建的文件描述符一定是最大的
#if 1
    int fd1, fd2, fd3, fd4;
    fd1 = open("test.txt", O_RDONLY | O_CREAT, 0664);
    fd2 = open("test.txt", O_RDONLY | O_CREAT, 0664);
    fd3 = open("test.txt", O_RDONLY | O_CREAT, 0664);
    fd4 = open("test.txt", O_RDONLY | O_CREAT, 0664);

    printf("fd1 = %d\n", fd1);
    printf("fd2 = %d\n", fd2);
    printf("fd3 = %d\n", fd3);
    printf("fd4 = %d\n", fd4);

    close(fd2);

    int fd5, fd6;
    fd5 = open("test.txt", O_RDONLY | O_CREAT, 0664);
    fd6 = open("test.txt", O_RDONLY | O_CREAT, 0664);
    printf("fd5 = %d\n", fd5);
    printf("fd6 = %d\n", fd6);

#endif
    return 0;
}
