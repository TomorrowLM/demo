#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
int main(int argc, char *argv[])
{
  int fd;
  if ((fd = open("file.txt", O_RDONLY)) == -1)
  {
    perror("fail to open");
    return -1;
  }

  // 子进程会继承父进程的一些公有的区域，如磁盘空间，内核空间
  // 文件描述符的偏移量保存在内核空间中，所以父进程改变偏移量，则子进程获取的偏移量是改变之后的
  pid_t pid;
  pid = fork();
  if (pid < 0)
  {
    perror("fail to fork");
    return -1;
  }
  if (pid > 0)
  {
    printf("This is a parent process\n");

    char buf[32] = "";
    if (read(fd, buf, 30) == -1)
    {
      perror("fail to read");
      return -1;
    }

    printf("buf = [%s]\n", buf);
  }
  else
  {
    sleep(1);
    printf("This is a son process\n");

    char buf[32] = "";
    if (read(fd, buf, 30) == -1)
    {
      perror("fail to read");
      return -1;
    }

    printf("buf = [%s]\n", buf);
  }

  while (1)
  {
  }

  return 0;
}