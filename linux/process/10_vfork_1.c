#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
int main(int argc, char *argv[])
{
	pid_t pid;

	// 使用vfork函数创建完子进程后
	// 子进程会先执行，直到子进程执行exit或者exec后，父进程才会执行
	pid = vfork();
	if (pid < 0)
	{
		perror("fail to vfork");
		exit(1);
	}
	if (pid == 0) // 子进程的代码区
	{
		int i = 0;
		for (i = 0; i < 5; i++)
		{
			printf("this is son process\n");
			sleep(1);
		}
		exit(0);
	}
	else // 父进程代码区
	{
		while (1)
		{
			printf("this is father process\n");
			sleep(1);
		}
	}

	return 0;
}
