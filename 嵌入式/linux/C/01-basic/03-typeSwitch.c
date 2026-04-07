#include <stdio.h>
int main(int argc, char *argv[])
{
  //***************强制类型转换之自动转换******************
  // 注意自动类型转换都是在运算的过程中进行临时性的转
  // 并不会影响自动类型转换的变量的值和其类型

  // 参加运算的成员全部变成int类型的参加运算，结果也是int类型的
  printf("%d\n", 5 / 2);
  // 当表达式中出现了带小数点的实数，参加运算的成员全部变成double类型
  // 参加运算，结果也是double型
  printf("%f\n", 5.0 / 2);

  // 当表达式中有有符号数 也有无符号数，参加运算的成员变成无符号数
  // 加运算结果也是无符号数.(表达式中无实数)
  int a = -8;

  unsigned int b = 7;
  if (a + b > 0)
  {
    printf("a+b>0, %d\n", a + b);
  }
  else
  {
    printf("a+b<=0\n");
  }

  // 在赋值语句中等号右边的类型自动转换为等号左边的类型
  int m;
  float n = 5.8f; // 5.8后面加f代表5.8是float类型，不加的话，认为是double类型
  m = n;
  printf("m = %d\n", m);
  printf("n = %f\n", n); 

  //*************强制类型转换之强制转换************
  int x = 10;
  int y = 4;
  float w;
  w = (float)x / (float)y;
  printf("w = %f\n", w);

  return 0;
}