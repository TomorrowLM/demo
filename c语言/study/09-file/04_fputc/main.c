#include <stdio.h>

int main(int argc, char *argv[])
{
    FILE *fp;
    fp = fopen("C:/Users/lzx/Desktop/file.txt", "w");
    if(fp == NULL)
    {
        printf("fail to fopen\n");
        return -1;
    }

    //通过fputc函数向文件写入一个字符
    fputc('w', fp);
    fputc('h', fp);
    fputc('a', fp);
    fputc('t', fp);
    fputc('\n', fp);
    fputc('o', fp);

    return 0;
}
