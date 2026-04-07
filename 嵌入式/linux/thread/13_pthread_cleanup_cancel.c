#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <string.h>

void cleanup(void *arg)
{
	printf("clean up ptr = %s\n", (char *)arg);
	free((char *)arg);
}

void *thread(void *arg)
{
	char *ptr = NULL;
	
	/*建立线程清理程序*/ 
	printf("this is new thread\n");
	ptr = (char*)malloc(100);
	pthread_cleanup_push(cleanup, (void*)(ptr)); 
	bzero(ptr, 100);
	strcpy(ptr, "memory from malloc");
	
    sleep(10);

	/*注意push与pop必须配对使用，即使pop执行不到*/
	printf("before pop\n");
	pthread_cleanup_pop(1);
	return NULL;
}

int main(int argc, char *argv[])
{
	pthread_t tid;
	pthread_create(&tid, NULL, thread, NULL);  // 创建一个线程
	sleep(5); 
	printf("before cancel\n");
	/*子线程响应pthread_cancel后，会执行线程处理函数*/
	pthread_cancel(tid);
	pthread_join(tid,NULL);
	printf("process is dying\n");
	return 0;
}

