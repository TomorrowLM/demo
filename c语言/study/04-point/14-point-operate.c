#include <stdio.h>

//指针可以加一个整数,往下指几个它指向的变量，结果还是个地址
void test1()
{
    int a[10];
    int *p, *q;
    // p和q间隔8个字节，意味着加一个整数最终移动的字节数与指针变量的类型也有关系
    p = a;
    q = p + 2;

    printf("p = %p\n", p);
    printf("q = %p\n", q);

    return;
}

// 两个相同类型指针可以比较大小
//前提：只有两个相同类型的指针指向同一个数组的元素的时候，比较大小才有意义,指向前面元素的指针 小于 指向后面 元素的指针
void test2()
{
    int a[10];
    int *p, *q;
    p = &a[1];
    q = &a[6];
    if (p < q)
    {
        printf("p < q\n");
    }
    else if (p > q)
    {
        printf("p > q\n");
    }
    else
    {
        printf("p = q\n");
    }
}

//两个相同类型的指针可以做减法
void test3()
{
    int a[10];
    int *p, *q;
    p = &a[0];
    q = &a[3];
    printf("%d\n", q - p);
}

// 两个相同类型的指针可以相互赋值
void test4()
{
    int a = 100;
    int *p, *q;
    p = &a;

    printf("a = %d %d\n", a, *p);

    q = p;
    printf("*q = %d\n", *q);

    *q = 999;
    printf("a = %d\n", a);
}

int main(int argc, char *argv[])
{
    test3();
    return 0;
}
