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

    //ʹ��fgets��ȡ�ļ�����
    //fgetsÿ�ζ�ȡʱ����ȡ�ļ�һ�����ݣ�ֻҪ�����н���������������
    //�����Ҫ��ȡ���ֽ���С��һ�����ݣ���ֻ���ȡ�ڶ�������-1���ֽڣ�
    //���λ�ò�\0
    char buf[32] = "";
    //fgets(buf, 8, fp);
    fgets(buf, 32, fp);
    printf("buf = %s\n", buf);

    return 0;
}
