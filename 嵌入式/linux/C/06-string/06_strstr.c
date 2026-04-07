#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    //使用strstr函数在一个字符串中查找另一个字符串
    char s[] = "1234:4567:666:789:666:7777";

    //strstr查找的时候，查找的是第二个参数的第一个\0之前的内容
    char *ret = strstr(s, "666");

    if(ret == NULL)
    {
        printf("没找到\n");
    }
    else
    {
        printf("找到了，在当前字符串的第%d个位置\n", ret - s);
    }


    return 0;
}
