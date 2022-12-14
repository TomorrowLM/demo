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

    //使用fgets读取文件内容
    //fgets每次读取时最多读取文件一行内容，只要遇到行结束符就立即返回
    //如果想要读取的字节数小于一行内容，则只会读取第二个参数-1个字节，
    //最后位置补\0
    char buf[32] = "";
    //fgets(buf, 8, fp);
    fgets(buf, 32, fp);
    printf("buf = %s\n", buf);

    return 0;
}
