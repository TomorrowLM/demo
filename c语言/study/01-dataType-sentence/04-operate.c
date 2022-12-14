#include <stdio.h>
int main(int argc, char *argv[])
{
  //位运算
  printf("%d\n", 3 << 2);
  printf("%d\n", 3 >> 1);
  printf("%d\n", -1 >> 3); //结果还是‐1 证明是算数右移
  printf("%d\n", 15 >> 2);
  //自增
  int a = 2;
  int b = ++a;
  int c = a++;
  printf("%d,%d,%d\n", a, b, c);
  // go循环
  //使用goto实现跳转
  printf("11111111111111\n");
  goto NEXT;
  printf("22222222222222\n");
  printf("33333333333333\n");

NEXT:
  printf("44444444444444\n");
  printf("hello world\n");

  return 0;
}