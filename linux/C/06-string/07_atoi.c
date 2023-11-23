#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    //使用atoi将数字型字符串转化为整形数据
    char s1[] = "7856";
    int ret1 = atoi(s1);

    printf("ret1 = %d\n", ret1);

    //使用atof将浮点型的字符串转化为浮点型数据
    char s2[] = "3.1415926";
    double ret2 = atof(s2);

    printf("ret2 = %lf\n", ret2);

    return 0;
}
