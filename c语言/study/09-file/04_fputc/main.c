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

    //ͨ��fputc�������ļ�д��һ���ַ�
    fputc('w', fp);
    fputc('h', fp);
    fputc('a', fp);
    fputc('t', fp);
    fputc('\n', fp);
    fputc('o', fp);

    return 0;
}
