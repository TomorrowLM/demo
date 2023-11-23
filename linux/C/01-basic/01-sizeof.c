#include <stdio.h>

//测试基本数据类型所占内存大小
int main()
{
    printf("Hello World!\n");
    char a;
    short b;
    int c;
    long d;
    float e;
    double f;
    typedef int int16;
    int g;
    int16 h;
    //sizeof: 是一个运算符，可以获取数据类型所占内存大小
    printf("%d\n", sizeof(a)); // 1
    printf("%d\n", sizeof(b)); // 2
    printf("%d\n", sizeof(c)); // 4
    printf("%d\n", sizeof(d)); // 4
    printf("%d\n", sizeof(e)); // 4
    printf("%d\n", sizeof(f)); // 8
    printf("%d\n", sizeof(g)); // 4
    printf("%d\n", sizeof(h)); // 4
    return 0;
}
