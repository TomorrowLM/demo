#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include <semaphore.h>

//使用信号量实现同步功能，如果两个线程实现同步，需要通过两个信号量

char ch = 'a';

//第一步：创建两个信号量
sem_t sem_g, sem_p;

void * pthread_g(void *arg) 
{
	while(1)
	{
        //第四步：后执行的线程中，信号量的初始值设置为0的信号量执行P操作
        sem_wait(&sem_g);

		ch++;
		sleep(1);

        //第六步：后执行的线程执行完毕后，信号量初始值为1的信号量执行V操作
        sem_post(&sem_p);
	}
}
void * pthread_p(void *arg)  //此线程打印ch的值
{
	while(1)
	{
        //第三步：先执行的线程中，信号量初始值设置为1的信号量执行P操作
        sem_wait(&sem_p);

		printf("%c",ch);
		fflush(stdout);

        //第五步：当先执行的线程执行完毕后，信号量初始值为0的信号量执行V操作
        sem_post(&sem_g);
	}
}

int main(int argc, char *argv[])
{
    //初始化信号量
    sem_init(&sem_g, 0, 0);
    sem_init(&sem_p, 0, 1);

	pthread_t tid1,tid2;
	
	pthread_create(&tid1,NULL,pthread_g,NULL);
	pthread_create(&tid2,NULL,pthread_p,NULL);
	
	pthread_join(tid1,NULL);
	pthread_join(tid2,NULL);

    printf("\n");

    //第七步：使用完毕后销毁信号量
    sem_destroy(&sem_g);
    sem_destroy(&sem_p);

	return 0;
}