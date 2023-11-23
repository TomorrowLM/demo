#include <stdio.h>

// const修饰全局变量
// 此时全局变量只能使用但是不能修改，
// 如果直接拿全局变量修改值，编译直接报错
// 如果使用全局变量的地址修改值，运行时程序异常结束
const int a = 100;
void test1()
{
    printf("a = %d\n", a);

    // a = 666;
    // printf("a = %d\n", a);

    int *p = &a;
    *p = 888;
    printf("a = %d\n", a);
}

// const修饰普通局部变量
// 可以读取变量的值
// 不能直接通过变量进行修改值，编译报错
// 可以通过变量的地址修改值
void test2()
{
    const int b = 100;
    printf("b = %d\n", b);

    // b = 666;
    // printf("b = %d\n", b);

    int *p = &b;
    *p = 888;
    printf("b = %d\n", b);
}

// const修饰指针变量
// 如果const修饰指针变量的类型，无法通过指针变量修改地址里面的值
// 如果const修饰指针变量，无法修改指针变量保存的地址
// 如果const既修饰指针变量的类型，又修饰指针变量，则只能通过原本变量修改值
void test3()
{
    int c = 100;
    // const修饰指针变量的类型
    // const int * p = &c;
    // const修饰指针变量
    // int * const p = &c;
    // const既修饰指针变量的类型，又修饰指针变量
    const int *const p = &c;
    printf("*p = %d\n", *p);

    c = 666;
    printf("*p = %d\n", *p);

    *p = 777;
    printf("*p = %d\n", *p);

    int d = 888;
    p = &d;
    printf("*p = %d\n", *p);
}

int main(int argc, char *argv[])
{
    test3();

    return 0;
}
