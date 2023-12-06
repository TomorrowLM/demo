#include <stdio.h>
#include <arpa/inet.h>

int main(int argc, char const *argv[])
{
    int a = 0x12345678;
    short b = 0x1234;

    printf("%#x\n", htonl(a));
    printf("%#x\n", htons(b));

    return 0;
}

