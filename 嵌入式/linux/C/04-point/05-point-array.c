#include <stdio.h>

int main(int argc, char *argv[])
{
  int a[5] = {0, 1, 6, 3, 4};
  int *p;
  p = a;

  //只要将数组名赋值给同类型的指针变量，则此时的指针变量与数组名可以用相同的方法操作数组
  printf("a[2]=%d\n", a[2]);
  printf("p[2]=%d\n", p[2]);

  //*(a + n) <==> *(p + n) <==> a[n] <==> p[n]
  printf("*(p+2) = %d\n", *(p + 2));
  printf("*(a+2) = %d\n", *(a + 2));

  printf("p=%p\n", p);
  printf("p+2=%p\n", p + 2);
  printf("&a[0] = %p\n", &a[0]);
  printf("&a[2] = %p\n", &a[2]);
  return 0;
}
