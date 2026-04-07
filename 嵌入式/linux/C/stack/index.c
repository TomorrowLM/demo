#include "./index.h"

int main()
{
    SetConsoleOutputCP(65001); // 中文输出变成乱码 (STU *)malloc(sizeof(STU))
    SqStack *stackList = (SqStack *)malloc(sizeof(SqStack));
    stack_push(&stackList, 1);
    printf("%d\n", stackList->data[0]);
}
