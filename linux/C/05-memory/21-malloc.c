#include <stdio.h>
#include <stdlib.h>

//指针函数：指针作为函数的返回值
char *fun()
{
    //char ch[100] = "hello world";

    //静态全局区的空间只要开辟好，除非程序结束，否则不会释放，所以
    //如果是临时使用，不建议使用静态全局区的空间
    //static char ch[100] = "hello world";

    //堆区开辟空间，手动申请手动释放，更加灵活
    //使用malloc函数的时候一般要进行强转
    char *str = (char *)malloc(100 * sizeof(char));
    str[0] = 'h';
    str[1] = 'e';
    str[2] = 'l';
    str[3] = 'l';
    str[4] = 'o';
    str[5] = '\0';

    return str;
}

int main(int argc, char *argv[])
{
    char *p;
    p = fun();
    printf("p = %s\n", p);

    //使用free函数释放空间
    free(p);
    //防止野指针
    p = NULL;

    return 0;
}
