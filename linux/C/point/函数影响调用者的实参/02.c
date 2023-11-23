#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MaxSize 10
/**
 * 结构体指针不需要用二级指针
 */

typedef struct
{
  int data[MaxSize];
  int length;
} List;

void initList(List *L)
{
  // List *P = *L;
  // printf("%d,9", MaxSize);
  // printf("1,%d \n", P->length);
  L->length = 220;
  for (int i = 0; i < MaxSize; i++)
  {
    L->data[i] = i;
  }
}

void main()
{
  List *L;
  L = (List *)malloc(sizeof(List));
  initList(L);
  for (int i = 0; i < MaxSize; i++)
  {
    printf("%d \n", L->data[i]);
  }
  printf("%d", L->length);
}