#include "./index.h"

int main()
{
    SetConsoleOutputCP(65001); // 中文输出变成乱码 (STU *)malloc(sizeof(STU))
    SqQueue *queueList = (SqQueue *)malloc(sizeof(SqQueue));
    queue_init(&queueList);
    printf("%d\n", queueList->front);
    if (queueList->front == queueList->rear)
    {
        printf("队列为空");
    }
}
