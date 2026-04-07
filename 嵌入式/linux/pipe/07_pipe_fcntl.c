#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <fcntl.h>

int main(int argc, char *argv[])
{
	int fd_pipe[2];
	char buf[] = "hello world";
	pid_t pid;

	if (pipe(fd_pipe) < 0)
	{
		perror("fail to pipe");
		exit(1);
	}

	pid = fork();
	if (pid < 0)
	{
		perror("fail to fork");
		exit(0);
	}
	if (pid == 0)
	{
		while (1)
		{
			sleep(5);
			printf("2%s\n",buf);
			write(fd_pipe[1], buf, strlen(buf));
		}
	}
	else
	{
		// 将fd_pipe[0]设置为阻塞
		fcntl(fd_pipe[0], F_SETFL, 0);
		// 将fd_pipe[0]设置为非阻塞
		// fcntl(fd_pipe[0], F_SETFL, O_NONBLOCK);

		while (1)
		{ 
			printf("count:%ld\n",sizeof(buf));
			printf("1-%s\n",buf);
			memset(buf, 0, sizeof(buf));// 清除字符串中的内容
			printf("1-%s\n",buf);
			read(fd_pipe[0], buf, sizeof(buf));
			printf("buf=[%s]\n", buf);
			sleep(1);
		}
	}
	return 0;
}