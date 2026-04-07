#include <stdio.h>
//基本数据类型的学习和使用
// char short int long float double
int main(int argc, char *argv[])
{
  //定义一个short类型的变量并赋值
  short b = 100;
  printf("b = %d\n", b);

  //定义一个int类型的变量并赋值，输出int类型变量的值使用%d
  int c = 9999;
  printf("c = %d\n", c);
  //输出八进制数，用%o
  printf("c = %o\n", c);
  //使用%#o，可以输出八进制数的前导符
  printf("c = %#o\n", c);
  //输出十六进制数
  printf("c = %x\n", c);
  // 使用%#x，可以输出十六进制数的前导符
  printf("c = %#x\n", c);

  //定义一个long类型的变量并赋值，输出long类型变量的值使用%ld
  long d = 34536453;
  printf("d = %ld\n", d);

  //定义一个float类型的变量并赋值，输出float类型变量的值使用%f
  //默认保留小数点后六位，并且可以四舍五入
  float e = 3.1415926;
  printf("e = %f\n", e);

  //定义一个double类型的变量并赋值，输出double类型变量的值使用%lf
  double f = 3452.2345324523452;
  printf("f = %lf\n", f);

  //输出字符，使用%c输出字符，使用%d可以输出字符的ascii码值
  char g = 'y';
  printf("g = %c %d\n", g, g);

  //输出字符串，使用%s
  //没有专门的变量保存字符串，一般使用数组来保存
  char h[] = "hello world";
  printf("e = %s\n", h);

  //输出地址，使用%p
  int i = 999;
  //&：取一个变量的地址，一般地址用十六进制数标识
  printf("&f = %p\n", &i);

  int m = 456;
  printf("%d%d\n", m, m);
  //%5d：输出的宽度为5，右对齐，如果实际数据的宽度小于5，则左边位置补空格，如果大于5，则没有用
  printf("%5d%5d\n", m, m);
  //%05d：输出的宽度为5，右对齐，如果实际数据的宽度小于5，则左边位置补0，如果大于则没有用
  printf("%05d%05d\n", m, m);
  //%‐5d：输出的宽度为5，左对齐，如果实际数据的宽度小于5，则右边补空格，如果大于则没有用
  printf("%‐5d%‐5d\n", m, m);
  float n = 3.678;
  printf("n = %f\n", n);
  //%.2f：小数点后保留两位并且可以四舍五入
  printf("n = %.2f\n", n);

  // ascii:注意在使用字符类型的数据时，如果用%c输出就是输出字符，如果用%d就是输出字符的ascii值
  char ch1 = 'w';
  printf("ch1 = %c %d\n", ch1, ch1);
  char ch2 = 97;
  printf("ch2 = %c %d\n", ch2, ch2);
  return 0;
}