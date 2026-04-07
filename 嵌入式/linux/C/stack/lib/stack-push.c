#include "../index.h"

boolean stack_push(SqStack **S, int x)
{
  printf("132\n", x);
  SqStack *s = *S;
  if (s->top == MaxSize - 1)
  {
    return FALSE;
  }
  printf("%d\n", s->top);
  s->data[0] = x;
  s->top = s->top + 1;
  return TRUE;
}