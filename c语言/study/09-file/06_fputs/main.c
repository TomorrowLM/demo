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

    //ͨ��fputs�������ļ�д������
    fputs("66666666666666\n", fp);
    fputs("nihao", fp);

    return 0;
}
