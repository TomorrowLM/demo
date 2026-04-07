#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    //使用strcpy函数拷贝字符串
    char s1[32] = "hello world";
    //使用strcpy函数时，必须保证第一个参数的内存足够大
    //char s1[5] = "abcd";
    char s2[32] = "abcdefg";

    strcpy(s1, s2);

    printf("s1 = %s\n", s1);

    int i;
    for(i = 0; i < 32; i++)
    {
        printf("[%c] - %d\n", s1[i], s1[i]);
    }

    return 0;
}
