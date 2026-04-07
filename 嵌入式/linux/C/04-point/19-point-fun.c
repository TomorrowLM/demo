#include <stdio.h>

//传数值
//函数的传参方式之复制传参：将实参的值传递给形参，不管形参怎么改变，跟实参都没有关系
void myfun1(int a, int b)
{
  printf("-------myfun1\n");
  int temp;
  temp = a;
  a = b;
  b = temp;

  printf("in fun: a = %d, b = %d\n", a, b);
  printf("&a = %p, &b = %p\n", &a, &b);
}

//传地址
//函数的传参方式之地址传参：将实参的地址传递给形参，形参对保存的地址的内容
//进行任何操作，实参的值也会跟着改变
void myfun2(int *p, int *q)
{
  printf("-------myfun2\n");
  int temp;
  temp = *p;
  *p = *q;
  *q = temp;

  printf("in fun: *p = %d, *q = %d\n", *p, *q);
  printf("p = %p, q = %p\n", p, q);
}

void test1()
{
  printf("-------test1\n");
  int a = 100, b = 20;
  printf("before fun: a = %d, b = %d\n", a, b);
  printf("&a = %p, &b = %p\n", &a, &b);
  myfun1(a, b);
  myfun2(&a, &b);
  printf("after fun: a = %d, b = %d\n", a, b);
}

//传一维数组
// void fun1(int p[])//形式1
void fun1(int *p) //形式2(常用)
{
  printf("%d\n", p[2]);
  printf("%d\n", *(p + 3));
}

void test2()
{
  int a[10] = {1, 2, 3, 4, 5, 6, 7, 8};
  fun1(a);
}

//传二维数组
// void fun2( int p[][4] )//形式1
void fun2(int (*p)[4]) //形式2：通过数组指针
{
  // p[x][y] <==> *(*(p + x) + y)
  printf("%d\n", p[0][2]);
  printf("%d\n", *(*(p + 1) + 2));
}

void test3()
{
  int a[2][4] = {1, 2, 3, 4, 5, 6, 7, 8};
  fun2(a);
}

//传指针数组
void fun3(char **q)
{
  int i;
  for (i = 0; i < 3; i++)
  {
    printf("%s\n", q[i]);
  }
}

void test4()
{
  char *p[3] = {"hello", "world", "kitty"};
  fun3(p);
}

//指针函数：指针作为函数的返回值
char *fun4()
{
  //栈区开辟的空间会随着当前代码段的结束而释放空间
  // char str[100]="hello world";

  //静态区的空间不会随着当前代码段的结束而释放空间
  static char str[100] = "hello world";

  return str;
}

void test5()
{
  char *p;
  p = fun4();
  printf("p = %s\n", p);
}

int main(int argc, char *argv[])
{
  // test1();
  test5();

  return 0;
}
