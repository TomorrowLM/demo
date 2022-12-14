#include <stdio.h>

int add(int x, int y)
{
  return x + y;
}
int sub(int x, int y)
{
  return x - y;
}
int mux(int x, int y)
{
  return x * y;
}
int dive(int x, int y)
{
  return x / y;
}

int process(int (*p)(int, int), int a, int b)
{
  int ret;
  ret = (*p)(a, b);
  return ret;
}

int main(int argc, char *argv[])
{
  int num;
  num = process(add, 2, 3);
  printf("num = %d\n", num);

  num = process(sub, 2, 3);
  printf("num = %d\n", num);

  num = process(mux, 2, 3);
  printf("num = %d\n", num);

  num = process(dive, 2, 3);
  printf("num = %d\n", num);

  return 0;
}
