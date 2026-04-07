#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main(void)
{
	int fd1;
	int fd2;
	
	fd1 = open("test.txt", O_CREAT | O_WRONLY, 0664);
	if (fd1 < 0)
	{
		perror("fail to open");
		exit(1);
	}

    //首先关闭1文件描述符，然后将fd1复制给1，意味着1和fd1都标识test.txt文件,返回值跟1是一样的
	fd2 = dup2(fd1, 1);
    printf("hello world\n");
	printf("fd2 = %d\n", fd2);

	return 0;
}