#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    // 使用strlen函数获取字符串的长度
    //  strlen获取的字符串的长度遇到第一个\0结束
    char s1[100] = "hel\0lo";
    printf("s1_len = %d\n", strlen(s1));
    printf("s1_size = %d\n", sizeof(s1));

    char *s2 = "hello";

    printf("s2_len = %d\n", strlen(s2));
    printf("s2_size = %d\n", sizeof(s2));

    return 0;
}
