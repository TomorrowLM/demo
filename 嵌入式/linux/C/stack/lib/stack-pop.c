#include "../index.h"

boolean stack_pop(SqStack **S, int x)
{
  SqStack *s = *S;
  if (s->top == MaxSize - 1)
    return FALSE;
  s->data[s->top] = 0;
  s->top = s->top - 1;
  return TRUE;
}