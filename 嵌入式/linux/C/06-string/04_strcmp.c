#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    //使用strcmp比较两个字符串的内容是否一致
    //strcmp函数一个字符一个字符比较，只要出现不一样的，就会立即返回
    char s1[] = "hello";
    char s2[] = "hella";

    //int ret = strcmp(s1, s2);
    int ret = strncmp(s1, s2, 4);

    if(ret == 0)
    {
        printf("s1 = s2\n");
    }
    else if(ret > 0)
    {
        printf("s1 > s2\n");
    }
    else
    {
        printf("s1 < s2\n");
    }

    return 0;
}
