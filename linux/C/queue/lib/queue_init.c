#include "../index.h"

void queue_init(SqQueue **q)
{
  SqQueue *Q = *q;
  Q->rear = 0;
  Q->front = 0;
}