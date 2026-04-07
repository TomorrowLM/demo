#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void swap(int *p)
{
  *p = 12;
}

int main()
{
  int a = 1;
  swap(&a);
  printf("%d", a);
}