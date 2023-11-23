#include <stdio.h>

// 宏定义的好处是只要改变了定义是的常量表达式，则代码中只要使用这个宏定义的位置都会改变
#define PI 3.1415926

// 带参宏
// 带参宏类似于一个简单的函数，将函数的参数进行设置，就可以传递给对应的表达式
// #define S(a, b) a*b
#define S(a, b) ((a) * (b))

int main(int argc, char *argv[])
{
    printf("PI = %.7f\n", PI);

    double d = PI;
    printf("d = %lf\n", d);

    printf("%d\n", S(2, 4));
    // 注意：宏定义只是简单的替换，不会自动加括号
    // 带参宏1：2 + 8 * 4 = 34
    // 带参宏2：((2 + 8) * (4)) = 40
    printf("%d\n", S(2 + 8, 4));

    return 0;
}
