#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int a = 10;
int main(int argc, char *argv[])
{
	pid_t pid;
	int b = 9;

	// 使用vfork创建完子进程
	// 在子进程执行exit或者exec之前，父子进程共有同一块地址空间
	pid = vfork();
	if (pid < 0)
	{
		perror("fail to vfork");
		exit(1);
	}
	if (pid == 0)
	{
		a++;
		b++;
		printf("in son process a=%d, b=%d\n", a, b);
		exit(0);
	}
	else
	{
		printf("in father process a=%d, b=%d\n", a, b);
	}
	return 0;
}
