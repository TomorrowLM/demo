#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>

int main(int argc, char *argv[])
{
	int i = 0;

	// 创建信号集并在信号集中添加信号
	sigset_t set;
	sigemptyset(&set);
	sigaddset(&set, SIGINT);

	while (1)
	{
		// 将set信号集添加到信号阻塞集中
		sigprocmask(SIG_BLOCK, &set, NULL);
		for (i = 0; i < 5; i++)
		{
			printf("SIGINT signal is blocked\n");
			sleep(1);
		}

		// 将set信号集从信号阻塞集中删除
		sigprocmask(SIG_UNBLOCK, &set, NULL);
		for (i = 0; i < 5; i++)
		{
			printf("SIGINT signal unblocked\n");
			sleep(1);
		}
	}
	return 0;
}