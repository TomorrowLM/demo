#include <stdio.h>

int main(int argc, char *argv[])
{
    //ʹ��fopen�����򿪻��ߴ����ļ��������ļ�ָ��
    FILE *fp;
    //��ֻ���ķ�ʽ���ļ�������ļ��������򱨴�
    fp = fopen("C:/Users/����/Desktop/1.txt", "r");

    //��ֻд�ķ�ʽ���ļ�������ļ��������򴴽�������ļ��������
    //fp = fopen("C:/Users/lzx/Desktop/file.txt", "w");

    //��ֻд�ķ�ʽ���ļ�������ļ��������򴴽�������ļ�������׷��
    // fp = fopen("C:/Users/����/Desktop/1.txt", "a");
    if(fp == NULL)
    {
        printf("fail to fopen\n");
        return -1;
    }

    //ʹ��fclose�ر��ļ�
    fclose(fp);

    return 0;
}
