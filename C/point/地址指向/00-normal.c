#include <stdio.h>

void test(int *a)
{
  printf("%p\n", a);
  *a = 100;
}

void main()
{
  int x = 1;
  printf("%p\n", &x);
  test(&x);
  printf("%d", x);
}