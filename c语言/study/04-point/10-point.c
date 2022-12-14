#include <stdio.h>

int main(int argc, char *argv[])
{
  //定义一个普通变量
  int a = 100;
  //定义一个指针变量
  int *p;

  //给指针变量赋值
  //将a的地址保存在p中
  p = &a;

  printf("a = %d %d\n", a, *p);
  printf("&a = %p %p\n", &a, p);


  short *b;
  int *c;
  long *d;
  float *e;
  double *f;

  printf("sizeof(b) = %d\n", sizeof(b)); //4
  printf("sizeof(c) = %d\n", sizeof(c)); //4
  printf("sizeof(d) = %d\n", sizeof(d)); //4
  printf("sizeof(e) = %d\n", sizeof(e)); //4
  printf("sizeof(f) = %d\n", sizeof(f)); //4
  return 0;
}
