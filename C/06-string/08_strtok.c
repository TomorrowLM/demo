#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    //使用strtok函数切割字符串
    char s[] = "111:22222:33:4444444444:5555555555555";
    char *ret;

    //第一次切割
    ret = strtok(s, ":");
    printf("ret = %s\n", ret);

    //后面所有切割时都要将strtok的第一个参数传NULL
    while((ret = strtok(NULL, ":")) != NULL)
    {
        printf("ret = %s\n", ret);
    }

    return 0;
}
