#include <stdio.h>

//定义一个普通全局变量
//只要是在main函数外（也在子函数外）的变量，就是全局变量
//如果全局变量没有进行初始化，则系统自动将其初始化为0
// int num;
// //全局变量可以在程序的任意一个位置进行对其的操作
// void myfun1()
// {
//   num = 888;
// }

//定义一个静态全局变量
//静态全局变量只能在其定义的.c文件中任意位置使用，不能跨文件使用
static int num;
void myfun2()
{
  num++;
}

//定义一个局部变量
//在函数内部定义的，不加任何修饰的变量都是局部变量
void myfun3()
{
  int num = 100;
  num++;
  printf("num = %d\n", num);
  return;
}

//定义一个静态局部变量
//在函数内部定义的使用static修饰的变量就是静态局部变量
void myfun4()
{
    //如果普通局部变量不进行初始化，则默认是随机值
    //如果静态局部变量不进行初始化，则默认是0
    int a; //普通局部变量
    static int num; //静态局部变量
    printf("a = %d\n", a);
    printf("num = %d\n", num);
}

void myfun5()
{
    //静态局部变量不会随着当前函数执行结束而释放空间，下次使用的函数之前的空间
    //静态局部变量只会初始化一次
    static int num1 = 100;
    num1++;
    printf("num1 = %d\n", num1);
}

int main(int argc, char *argv[])
{
  printf("num = %d\n", num);
  myfun5();
  printf("num = %d\n", num);
  //局部变量只能在定义的函数内部使用，声明周期相对较短，函数结束，局部变量就会释放
  // printf("num = %d\n", num);
  myfun5();
  myfun5();
  myfun5();
  return 0;
}