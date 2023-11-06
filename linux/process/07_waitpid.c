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
		exit(0);
	}
	else
	{
		waitpid(pid, NULL, 0);
		printf("this is father process\n");
	}
	return 0;
}
