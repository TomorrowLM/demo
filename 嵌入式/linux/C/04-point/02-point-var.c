#include <stdio.h>

int main(int argc, char *argv[])
{
    int *p1,*p2,temp,a,b;
    p1=&a;
    p2=&b;

    printf("请输入:a b的值:\n");
    scanf("%d %d", p1, p2);//给p1和p2指向的变量赋值

    temp = *p1; //用p1指向的变量（a）给temp赋值
    *p1 = *p2; //用p2指向的变量（b）给p1指向的变量（a）赋值
    *p2 = temp;//temp给p2指向的变量（b）赋值

    printf("a=%d b=%d\n",a,b);
    printf("*p1=%d *p2=%d\n",*p1,*p2);

    return 0;
}
