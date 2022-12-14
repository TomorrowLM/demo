#include <stdio.h>

int main(int argc, char *argv[])
{
    FILE *fp;
    fp = fopen("C:/Users/lzx/Desktop/file.txt", "r");
    if(fp == NULL)
    {
        printf("fail to fopen\n");
        return -1;
    }

    //使用fread函数读取文件内容
    int num;
    char buf[128] = "";
    num = fread(buf, 5, 4, fp);

    printf("buf = %s\n", buf);
    printf("num = %d\n", num);

    return 0;
}
