#ifndef _STACK_
#define _STACK_

#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#define MaxSize 10 // 定义栈中元素的最大个数

typedef struct
{
  int data[MaxSize]; // 静态数组存放栈中元素
  int top;           // 栈顶指针
} SqStack;

boolean stack_push(SqStack **p_head, int x);
boolean stack_pop(SqStack **p_head, int x);
void stack_print(SqStack *p_head);

#endif
