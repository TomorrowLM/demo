#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    //使用strcat函数追加字符串
    char s1[32] = "hello world";
    char s2[32] = "abcdef";

    //strcat是从s1的\0的位置开始追加，直到s2的第一个\0复制完毕后结束
    strcat(s1, s2);

    printf("s1 = %s\n", s1);

    return 0;
}
