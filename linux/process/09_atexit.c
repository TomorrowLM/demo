#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void clear_fun1(void)
{
	printf("perform clear fun1 \n");
}

void clear_fun2(void)
{
	printf("perform clear fun2 \n");
}

void clear_fun3(void)
{
	printf("perform clear fun3 \n");
}

int main(int argc, char *argv[])
{
	// atexit函数在进程结束时才会去执行参数对应的回调函数
	// atexit多次调用后，执行顺序与调用顺序相反
	atexit(clear_fun1);
	atexit(clear_fun2);
	atexit(clear_fun3);
	printf("process exit 3 sec later!!!\n");
	sleep(3);
	return 0;
}