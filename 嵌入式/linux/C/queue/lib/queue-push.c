#include "../index.h"

void queue_push(SqQueue **q, int x)
{
  SqQueue *Q = *q;
  if ((Q->rear + 1) % MaxSize == Q->front) // 队满
    return FALSE;
  Q->data[Q->rear] = x;
  Q->rear = (Q->rear + 1) % MaxSize; // 循环队列，模运算将无限的整数域映射到有限的整数上，这里rear取余总是小于10，形成环状
  return TRUE;
}