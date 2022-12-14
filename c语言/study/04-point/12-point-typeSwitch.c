#include <stdio.h>

int main(int argc, char *argv[])
{
    int a = 0x1234, b = 0x5678;
    char *p1, *p2;
    printf("%#x %#x\n", a, b);
    p1 = (char *)&a;
    p2 = (char *)&b;
    printf("%#x %#x\n", *p1, *p2);
    p1++;
    p2++;
    printf("%#x %#x\n", *p1, *p2);
    // 1：*+指针 取值，取几个字节，由指针类型决定的指针为字符指针则取一个字节，
    // 指针为整型指针则取4个字节，指针为double型指针则取8个字节。
    // 2：指针++ 指向下个对应类型的数据
    // 字符指针++ ，指向下个字符数据，指针存放的地址编号加1
    // 整型指针++,指向下个整型数据，指针存放的地址编号加4
    return 0;
}
