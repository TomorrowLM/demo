#include <stdio.h>

//sprintf和sscanf的基本用法
void test1()
{
    char buf[20];
    int a, b, c;

    sprintf(buf,"%d:%d:%d",2013,10,1);
    printf("buf = %s\n",buf);

    sscanf("2013:10:1", "%d:%d:%d", &a, &b, &c);
    printf("a=%d,b=%d,c=%d\n",a,b,c);
}

//sscanf高级用法
void test2()
{
    //1、跳过数据：%*s或%*d
    char buf1[20];
    sscanf("1234 5678","%*d %s",buf1);
    printf("%s\n",buf1);

    //2、读指定宽度的数据：%[width]s
    char buf2[20];
    sscanf("12345678","%4s ",buf2);
    printf("%s\n",buf2);

    //3、支持集合操作：只支持获取字符串
    //   %[a-z]  表示匹配a到z中任意字符(尽可能多的匹配)
    //   %[aBc]  匹配a、B、c中一员，贪婪性
    //   %[^aFc] 匹配非a、F、c的任意字符，贪婪性
    //	 %[^a-z] 表示读取除a-z以外的所有字符
    char buf3[20];
    sscanf("agcd32DajfDdFF","%[a-z]",buf3);
    printf("%s\n",buf3);
}

int main(int argc, char *argv[])
{
    test2();

    return 0;
}
