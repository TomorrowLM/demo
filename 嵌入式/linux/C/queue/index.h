#ifndef _STACK_
#define _STACK_

#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#define MaxSize 10 // 定义栈中元素的最大个数

typedef struct
{
  int data[MaxSize]; // 静态数组存放栈中元素
  int front, rear;   // 栈顶指针
} SqQueue;

void queue_init(SqQueue **p_head);
void queue_push(SqQueue **p_head, int x);
void queue_pop(SqQueue **p_head, int *x);
void stack_print(SqQueue *p_head);

#endif
