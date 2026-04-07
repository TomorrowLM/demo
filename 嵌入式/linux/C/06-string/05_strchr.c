#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    //使用strchr函数在一个字符串中查找字符
    char s[] = "hel6lo wor6ld";
    //找第一个匹配的字符
    char *ret = strchr(s, '6');
    //找最后一个匹配的字符
    //char *ret = strrchr(s, '6');

    if(ret == NULL)
    {
        printf("没有找到\n");
    }
    else
    {
        printf("找到了，在数组的第%d个位置\n", ret - s);
    }


    return 0;
}
