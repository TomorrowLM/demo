#include <stdio.h>
#include "myfun.h"
//函数的声明：一般当子函数定义在主函数的下方时，需要在主函数的上方进行声明
void myfun1();
void myfun2();
int myfun3();
void myfun4();
void myfun5(int a, int b);
int myfun6(int a, int b);
// void myfun();
int main(int argc, char *argv[])
{
  //函数的调用
  //函数在调用的时候如果没有参数，也必须加括号
  //函数调用的时候不能加返回值类型
  // myfun1();
  // myfun4();
  // extern void myfun();
  myfun();
  // printf("%d", myfun);
  return 0;
}
//定义一个没有参数也没有返回值的函数
void myfun1()
{
  printf("hello world\n");
  printf("nihao beijing\n");
  printf("welcome to 1000phone\n");

  return;
}
//定义一个有参数的函数
void myfun2(int a, int b)
{
  int sum;
  sum = a + b;

  printf("%d + %d = %d\n", a, b, sum);
}

//定义一个有返回值的函数
int myfun3(int a, int b)
{
  int sum;
  sum = a + b;

  return sum;
}

void myfun4()
{
  printf("hello world\n");
  printf("nihao beijing\n");
  printf("welcome to 1000phone\n");

  return;
}

void myfun5(int a, int b)
{
  int sum;
  sum = a + b;

  printf("%d + %d = %d\n", a, b, sum);
}

int myfun6(int a, int b)
{
  int sum;
  sum = a + b;

  return sum;
}
