#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>

int main(int argc, char *argv[])
{
#if 0
  //通过fork函数创建一个子进程
  //注意：主要执行一次fork，就会在原有的进程基础上创建一个新的子进程
  //如果fork之后不区分父子进程的代码区，则后面所有的代码都会执行两次，一次是父进程，一次是子进程
  fork();
  printf("hello world\n");

  while (1);
  return 0;
#endif
#if 1
  // 通过fork函数的返回值来区分父子进程的独立的代码区
  // 父子进程是来回交替执行的，谁先运行，谁后运行是不确定的，不要认为父进程执行完之后才会执行子进程
  pid_t pid;
  printf("111111/n\n");
  pid = fork();
  if (pid < 0)
  {
    perror("fail to fork");
    return -1;
  }
  else if (pid > 0) // 父进程的代码区
  {
    while (1)
    {
      printf("parent: pid = %d, ppid = %d\n", getpid(), getppid());
      printf("pid = %d\n", pid);
      printf("this is a parent process\n");
      sleep(1);
      printf("****************\n");
    }
  }
  else // 子进程的代码区
  {
    while (1)
    {
      printf("son: pid = %d, ppid = %d\n", getpid(), getppid());
      printf("this is a son process\n");
      sleep(1);
      printf("‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n");
    }
  }

  return 0;
#endif
}