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

    //ʹ��fgetc���ļ��ж�ȡһ���ַ�
//    int c = fgetc(fp);
//    printf("c = [%c] - %d\n", c, c);

//    c = fgetc(fp);
//    printf("c = [%c] - %d\n", c, c);

    //�ļ���ÿһ�н�����λ�ö���һ����ʶ����һ�����з�����֮Ϊ�н�����
    //fgetc���Զ�ȡ���н�����
    int c;
    while((c = fgetc(fp)) != EOF)
    {
        printf("c = [%c] - %d\n", c, c);
    }

    return 0;
}
