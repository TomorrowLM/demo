#include <stdio.h>

int main(int argc, char *argv[])
{
    FILE *fp;
    if((fp = fopen("C:/Users/lzx/Desktop/file.txt","w+"))==NULL)
    {
        printf("fail to fopen\n");
        return -1;
    }

    fputs("123456789\n", fp);
    fputs("abcdefghijklmn", fp);

    //获取当前文件指针的读写位置
    printf("offset = %ld\n", ftell(fp));

    //将当前文件的读写文件设置到文件的起始位置
    //rewind(fp);
    //fseek(fp, 0, SEEK_SET);

    //将当前文件的读写位置设置为倒数第五个位置
    fseek(fp, -5, SEEK_END);

    char buf[32] = "";
    while(fgets(buf, 32, fp) != NULL)
    {
        printf("[%s]\n", buf);
    }

    return 0;
}
