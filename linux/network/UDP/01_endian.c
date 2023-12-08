#include <stdio.h>

// 判断当前系统的字节序

union un
{
    int a;
    char c;
    char b;
};

int main(int argc, char const *argv[])
{
    union un myun; // 共用体所有成员占有同一段地址空间
    myun.a = 0x12345678;
    // 使用%#x，可以输出十六进制数的前导符
    printf("a = %#x\n", myun.a);
    printf("c = %#x\n", myun.c);
    printf("b = %#x\n", myun.b);

    if (myun.b == 0x78)
    {
        printf("小端存储\n");
    }
    else
    {
        printf("大端存储\n");
    }

    return 0;
}
