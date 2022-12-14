#include <stdio.h>

int main(int argc, char *argv[])
{
    //使用fopen函数打开或者创建文件，返回文件指针
    FILE *fp;
    //以只读的方式打开文件，如果文件不存在则报错
    fp = fopen("C:/Users/李明/Desktop/1.txt", "r");

    //以只写的方式打开文件，如果文件不存在则创建，如果文件存在清空
    //fp = fopen("C:/Users/lzx/Desktop/file.txt", "w");

    //以只写的方式打开文件，如果文件不存在则创建，如果文件存在则追加
    // fp = fopen("C:/Users/李明/Desktop/1.txt", "a");
    if(fp == NULL)
    {
        printf("fail to fopen\n");
        return -1;
    }

    //使用fclose关闭文件
    fclose(fp);

    return 0;
}
