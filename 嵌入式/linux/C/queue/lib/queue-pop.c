#include "../index.h"

void queue_pop(SqQueue **q, int *x)
{
  SqQueue *Q = *q;
  if (Q->rear == Q->front) // 队空
    return FALSE;
  *x = Q->data[Q->front];
  Q->front = (Q->front + 1) % MaxSize; // 对头指针后移
  return TRUE;
}