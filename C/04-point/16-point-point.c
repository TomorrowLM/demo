#include <stdio.h>

int main(int argc, char *argv[])
{
    int a = 100;

    //定义一个一级指针
    //一级指针用于保存普通变量的地址
    int *p = &a;

    //定义一个二级指针
    //二级指针用于保存一级指针的地址
    int **q = &p;

    printf("a = %d %d %d\n", a, *p, **q);
    printf("&a = %p %p %p\n", &a, p, *q);
    printf("&p = %p %p\n", &p, q);
    printf("&q = %p\n", &q);

    return 0;
}
