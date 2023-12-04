#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <string.h>

void mycleanup(void *arg)
{
	printf("clean up ptr = %s\n", (char *)arg);
	free((char *)arg);
}

void *thread(void *arg)
{
	printf("this is new thread\n");
	char *ptr = NULL;
	ptr = (char *)malloc(100);
	// bzero(ptr, 100);
	strcpy(ptr, "memory from malloc");

	sleep(3);
	printf("before exit\n");
	/*建立线程清理程序*/
	pthread_cleanup_push(mycleanup, (void *)(ptr));
	pthread_exit(NULL);

	/*注意push与pop必须配对使用，即使pop执行不到*/
	printf("before pop\n");
	pthread_cleanup_pop(1);
}

int main(int argc, char *argv[])
{
	pthread_t tid;
	pthread_create(&tid, NULL, thread, NULL); // 创建一个线程
	pthread_join(tid, NULL);
	printf("process is dying\n");
	return 0;
}
