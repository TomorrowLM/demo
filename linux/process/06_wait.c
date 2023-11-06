#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int main(int argc, char *argv[])
{
	pid_t pid;

	pid = fork();
	if (pid < 0)
	{
		perror("fail to fork");
		return -1;
	}
	if (pid == 0)
	{
		int i = 0;
		for (i = 0; i < 5; i++)
		{
			printf("this is son process\n");
			sleep(1);
		}

		// 使用exit退出当前进程并设置退出状态
		exit(2);
	}
	else
	{
		// 使用wait在父进程中阻塞等待子进程的退出
		// 不接收子进程的退出状态
		// wait(NULL);

		// 接收子进程的退出状态，子进程中必须使用exit或者_exit函数退出进程是发送退出状态
		int status = 0;
		wait(&status);

		if (WIFEXITED(status) != 0)
		{
			printf("The son process return status: %d\n", WEXITSTATUS(status));
		}

		printf("this is father process\n");
	}

	return 0;
}